import {
  CalendarDays,
  KeyRound,
  LogOut,
  Palette,
  ShieldCheck,
  UserRound
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Not provided";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not provided"
    : date.toLocaleDateString();
};

function SettingsPage({ user, onSignOut }) {
  const accountStatus =
    typeof user.isActive === "boolean"
      ? user.isActive
        ? "Active"
        : "Inactive"
      : user.accountStatus || user.status || "Not provided";

  return (
    <div className="settings-page">
      <div className="workspace-page-intro">
        <span className="section-kicker">YOUR ACCOUNT</span>
        <p>Review your account details and sign-in session.</p>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-heading">
            <UserRound size={19} />
            <div>
              <h3>Account Information</h3>
              <p>Profile details provided by your authenticated account.</p>
            </div>
          </div>
          <dl className="settings-details">
            <div>
              <dt>Name</dt>
              <dd>{user.name || "Not provided"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email || "Not provided"}</dd>
            </div>
            <div>
              <dt>Account status</dt>
              <dd>{accountStatus}</dd>
            </div>
            <div>
              <dt>Account type</dt>
              <dd>{user.role || "Not provided"}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
          <p className="settings-note">
            Profile details are read-only; profile editing is not available.
          </p>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <Palette size={19} />
            <div>
              <h3>Appearance</h3>
              <p>SHIELDHER currently uses its dark navy theme.</p>
            </div>
          </div>
          <div className="settings-info-row">
            <span>Current appearance</span>
            <strong>Dark theme</strong>
          </div>
          <p className="settings-note">
            Theme switching is not configured, so no preference control is
            shown.
          </p>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <ShieldCheck size={19} />
            <div>
              <h3>Security</h3>
              <p>Keep your account and personal information protected.</p>
            </div>
          </div>
          <div className="settings-info-row">
            <span>Sign-in session</span>
            <strong>Active in this browser</strong>
          </div>
          <div className="settings-security-note">
            <KeyRound size={17} />
            <p>
              Requests use your existing authenticated session. Your
              authentication token is not displayed here.
            </p>
          </div>
          <p className="settings-note">
            Always sign out when using a shared or public device.
          </p>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <CalendarDays size={19} />
            <div>
              <h3>Session Management</h3>
              <p>End this browser session when you are finished.</p>
            </div>
          </div>
          <button
            className="settings-signout"
            type="button"
            onClick={onSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
