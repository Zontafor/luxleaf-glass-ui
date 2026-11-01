import { mountGlass } from "../src/index";
document.querySelector("#run")!.addEventListener("click", () => {
  const checks: string[] = [];
  const check = (name: string, passed: boolean) => {
    if (!passed) throw new Error(name);
    checks.push("PASS " + name);
  };
  const element = document.createElement("button");
  element.textContent = "Native control";
  element.style.color = "red";
  document.body.append(element);
  const original = element.getAttribute("style");
  try {
    const glass = mountGlass(element);
    check("native button semantics preserved", element.tagName === "BUTTON");
    check(
      "filter is local and installed once",
      element.querySelectorAll("filter").length === 1,
    );
    glass.update({ blur: 5, shape: "pill" });
    check(
      "live style update applied",
      element.style.backdropFilter.includes("5px") &&
        element.style.borderRadius === "999px",
    );
    let rejected = false;
    try {
      glass.update({ blur: -1 });
    } catch {
      rejected = true;
    }
    check("invalid update rejected", rejected);
    glass.destroy();
    check(
      "dispose removes filter and restores style",
      element.querySelector("svg") === null &&
        element.getAttribute("style") === original,
    );
    glass.destroy();
    check("dispose is idempotent", element.getAttribute("style") === original);
    document.querySelector("#result")!.textContent =
      checks.join("\n") + "\nALL PASSED: " + checks.length;
  } catch (error) {
    document.querySelector("#result")!.textContent =
      checks.join("\n") + "\nFAILED: " + (error as Error).message;
  } finally {
    element.remove();
  }
});
