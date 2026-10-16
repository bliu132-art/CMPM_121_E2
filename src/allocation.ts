export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedProducers = 2;

function updateAllocation() {
  const { production, consumption, balance } = calculateSupplies();
  const rows: BarRow[] = [
    { label: "Production", value: production, color: "#27766b" },
    { label: "Consumption", value: consumption, color: "#a44d23" },
  ];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewAssignment();
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedProducers} / 6`, 18, 76);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const y = 102 + i * 52;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${row.value}`, 18, y);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, y + 8, row.value * 14, 20);
  }
  updateReport(production, consumption, balance);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedProducers = Math.max(0, assignedProducers - 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedProducers = Math.min(6, assignedProducers + 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedProducers = 2;
    updateAllocation();
  };
updateAllocation();

type BarRow = {
  label: string;
  value: number;
  color: string;
};

type SupplyResult = {
  production: number;
  consumption: number;
  balance: number;
};

function calculateSupplies(): SupplyResult {
  const production = assignedProducers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return { production, consumption, balance };
}

function updateReport(
  production: number,
  consumption: number,
  balance: number,
): void {
  readout.textContent =
    `Assigned: ${assignedProducers}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function drawCrewAssignment(): void {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < assignedProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assignedProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}
