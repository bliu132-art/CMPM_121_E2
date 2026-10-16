export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];
let x = 2;
let y = 2;
let direction = 0;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

type Command = {
  label: string;
  execute: () => void;
};

const forwardCommand: Command = {
  label: "Forward",
  execute(): void {
    const current = directions[direction];
    x = Math.max(0, Math.min(4, x + current.dx));
    y = Math.max(0, Math.min(4, y + current.dy));
    drawRover();
  },
};

const rightCommand: Command = {
  label: "Right",
  execute(): void {
    direction = (direction + 1) % directions.length;
    drawRover();
  },
};

function runCommand(command: Command): void {
  command.execute();
}

const queue: Command[] = [];
const list = document.querySelector<HTMLOListElement>("#rover-pending")!;
const status = document.querySelector<HTMLElement>("#rover-queue-status")!;
const run = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clear = document.querySelector<HTMLButtonElement>("#rover-clear")!;

run.disabled = false;
clear.disabled = false;

function showQueue(): void {
  list.replaceChildren();
  for (const command of queue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    list.append(item);
  }
  status.textContent = queue.length === 0 ? "Empty" : `${queue.length} pending`;
}

function enqueue(command: Command): void {
  queue.push(command);
  showQueue();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueue(forwardCommand);
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueue(rightCommand);
};

run.onclick = () => {
  for (const command of queue) {
    runCommand(command);
  }
  queue.length = 0;
  showQueue();
};

clear.onclick = () => {
  queue.length = 0;
  showQueue();
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  queue.length = 0;
  drawRover();
  showQueue();
};

drawRover();
showQueue();
