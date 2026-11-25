import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, RefreshCw, X } from "lucide-react";
import API from "../services/api";

const formatDateTime = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
};

const maskPhone = (value) => {
  if (!value) return "Phone unavailable";

  const digits = String(value).replace(/\D/g, "");
  if (digits.length <= 4) return String(value);

  return `•••• ${digits.slice(-4)}`;
};

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [markingId, setMarkingId] = useState(null);
  const dropdownRef = useRef(null);
  const requestIdRef = useRef(0);

  const requestNotifications = useCallback(
    () => API.getEmergencyNotifications(),
    []
  );

  const loadNotifications = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    try {
      const response = await requestNotifications();
      if (requestId === requestIdRef.current) {
        setNotifications(response.notifications || []);
        setError("");
      }
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError(requestError.message || "Unable to load notifications.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [requestNotifications]);

  const refreshNotifications = () => {
    setIsLoading(true);
    setError("");
    loadNotifications();
  };

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let active = true;

    requestNotifications()
      .then((response) => {
        if (active && requestId === requestIdRef.current) {
          setNotifications(response.notifications || []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active && requestId === requestIdRef.current) {
          setError(requestError.message || "Unable to load notifications.");
        }
      })
      .finally(() => {
        if (active && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [requestNotifications]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    const shouldOpen = !isOpen;
    setIsOpen(shouldOpen);

    if (shouldOpen) {
      setActionError("");
      refreshNotifications();
    }
  };

  const handleMarkRead = async (notificationId) => {
    setMarkingId(notificationId);
    setActionError("");

    try {
      const response = await API.markEmergencyNotificationRead(notificationId);
      const updatedNotification = response.notification;

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, ...(updatedNotification || {}), isRead: true }
            : notification
        )
      );
    } catch (requestError) {
      setActionError(
        requestError.message || "Unable to mark this notification as read."
      );
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="notification-control" ref={dropdownRef}>
      <button
        className="icon-button notification-button"
        type="button"
        onClick={handleToggle}
        aria-label={
          unreadCount
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section
          className="notification-panel"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="notification-panel-header">
            <div>
              <span className="section-kicker">SAFETY UPDATES</span>
              <h2>Notifications</h2>
            </div>
            <div className="notification-panel-actions">
              <button
                className="notification-refresh"
                type="button"
                onClick={refreshNotifications}
                disabled={isLoading}
                aria-label="Refresh notifications"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="notification-close"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <p className="notification-demo-note">
            Demo records only. No real SMS or WhatsApp message was sent.
          </p>

          {actionError && (
            <p className="notification-error" role="alert">
              {actionError}
            </p>
          )}

          {error ? (
            <div className="notification-state">
              <p role="alert">{error}</p>
              <button type="button" onClick={refreshNotifications}>
                Try again
              </button>
            </div>
          ) : isLoading && notifications.length === 0 ? (
            <p className="notification-state" role="status">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <p className="notification-state">
              You don't have any notification records yet.
            </p>
          ) : (
            <div className="notification-list" aria-live="polite">
              {notifications.map((notification) => (
                <article
                  className={`notification-item ${
                    notification.isRead ? "notification-read" : "notification-unread"
                  }`}
                  key={notification._id}
                >
                  <div className="notification-item-heading">
                    <div>
                      <strong>{notification.contactName || "Trusted contact"}</strong>
                      <span>{maskPhone(notification.phone)}</span>
                    </div>
                    <span
                      className={`notification-status status-${String(
                        notification.status || "simulated"
                      ).toLowerCase()}`}
                    >
                      {notification.status || "Simulated"}
                    </span>
                  </div>

                  <p className="notification-incident">
                    Incident: {notification.incident?.incidentType || "Not specified"}
                  </p>
                  <p className="notification-message">
                    {notification.message || "No notification message available."}
                  </p>
                  <time className="notification-time">
                    {formatDateTime(notification.createdAt)}
                  </time>

                  {!notification.isRead && (
                    <button
                      className="notification-mark-read"
                      type="button"
                      onClick={() => handleMarkRead(notification._id)}
                      disabled={markingId === notification._id}
                    >
                      <Check size={14} />
                      {markingId === notification._id
                        ? "Marking..."
                        : "Mark as Read"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default NotificationBell;
