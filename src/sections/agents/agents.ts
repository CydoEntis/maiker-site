// One agent name at a time lights up, rotating about every 800ms.
import { onTick, reduced } from "../../lib/ticker";

const list = document.querySelector<HTMLElement>("[data-agents]");
if (list && !reduced) {
  const items = [...list.children] as HTMLElement[];
  let i = 0;
  onTick(list, () => {
    i = (i + 1) % items.length;
    items.forEach((el, n) => el.toggleAttribute("data-on", n === i));
  }, 10);
}
