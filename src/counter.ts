export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missing: number;
};

function snapshot(charge: number): ShieldSnapshot {
  const capacity = 10;
  return { charge, capacity, missing: capacity - charge };
}

function drawMeter(state: ShieldSnapshot): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < state.capacity; i++) {
    ctx.fillStyle = i < state.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${state.charge} / ${state.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${state.charge} / ${state.capacity}`;
}

function updateStats(state: ShieldSnapshot): void {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(state);
}

function renderStats(state: ShieldSnapshot): void {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${state.charge} · Missing charge: ${state.missing}`;
}

function setCount(next: number): void {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  const state = snapshot(count);
  drawMeter(state);
  if (panel) updateStats(state);
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(snapshot(count));
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(snapshot(count));
