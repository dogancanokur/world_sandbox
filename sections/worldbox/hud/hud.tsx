import "./hud.css";

type HudProps = {
  wood: number;
  satiety: number;
};

export default function Hud() {
  //
  const satiety = 100;
  const wood = 0;

  return (
    <div className="hud">
      <div className="hud-title">Human</div>

      <div className="hud-row">
        <span className="hud-label">Satiety</span>
        <span className="hud-value">{satiety}</span>
      </div>

      <div className="hud-row">
        <span className="hud-label">Wood</span>
        <span className="hud-value">{wood}</span>
      </div>
    </div>
  );
}
