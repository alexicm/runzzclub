import { test, expect } from "@playwright/test";

test.describe("Apresentação executiva", () => {
  test("navega pelos 16 capítulos com teclado e menu", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("img", { name: "RUNZ" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("da comunidade");
    for (let i = 2; i <= 16; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(900);
      await expect(page).toHaveURL(new RegExp(`#c${String(i).padStart(2, "0")}$`));
    }
    await expect(page.getByText("próxima entrega", { exact: false }).first()).toBeVisible();
    await page.keyboard.press("Home");
    await page.waitForTimeout(900);
    await expect(page).toHaveURL(/#c01$/);
    await page.keyboard.press("m");
    await page.getByRole("button", { name: /11.*Simulador financeiro/ }).click();
    await page.waitForTimeout(900);
    await expect(page).toHaveURL(/#c11$/);
  });

  test("capítulo 02: marcar entrega como concluída recalcula o progresso", async ({ page }) => {
    await page.goto("/#c02");
    await page.reload();
    await page.waitForTimeout(1200);
    await expect(page.getByText("0 de 11 entregas")).toBeVisible();
    await page.getByRole("button", { name: /Aprovar oferta e regras do MVP/ }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("combobox").first().selectOption("concluida");
    await dialog.getByPlaceholder("Cole o link do documento, planilha ou print").fill("https://exemplo.com/oferta");
    await page.keyboard.press("Escape");
    await expect(page.getByText("1 de 11 entregas")).toBeVisible();
    // persiste após recarregar
    await page.reload();
    await page.waitForTimeout(1200);
    await expect(page.getByText("1 de 11 entregas")).toBeVisible();
  });

  test("capítulo 03: alterar a meta atualiza o MRR", async ({ page }) => {
    await page.goto("/#c03");
    await page.reload();
    await page.waitForTimeout(1200);
    await expect(page.getByText("R$ 59.850").first()).toBeVisible();
    await page.getByRole("tab", { name: /Cenário agressivo|^10\.000$/ }).locator("visible=true").first().click();
    await page.waitForTimeout(1200);
    await expect(page.getByText("R$ 399.000").first()).toBeVisible();
  });

  test("capítulo 11: aumentar churn reduz pagantes e muda payback", async ({ page }) => {
    await page.goto("/#c11");
    await page.reload();
    await page.waitForTimeout(1500);
    await expect(page.getByText("5.827").first()).toBeVisible();
    await expect(page.getByText("4º ciclo").first()).toBeVisible();
    const churn = page.locator('[data-slide="10"]').getByLabel("Churn mensal");
    await churn.focus();
    for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowRight"); // 7% -> 12%
    await page.waitForTimeout(1200);
    await expect(page.getByText("12%").first()).toBeVisible();
    await expect(page.getByText("5.827")).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "Personalizado" })).toHaveAttribute("aria-selected", "true");
  });

  test("capítulo 06: demonstração do MVP avança e muda com o objetivo", async ({ page }) => {
    await page.goto("/#c06");
    await page.reload();
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: /10k/ }).click();
    await expect(page.getByText("Prévia do plano 10k")).toBeVisible();
    await page.getByRole("button", { name: "Gerar plano" }).click();
    await expect(page.getByText("10k em 10 semanas.")).toBeVisible();
  });

  test("capítulo 16: decisão só muda com ação explícita", async ({ page }) => {
    await page.goto("/#c16");
    await page.reload();
    await page.waitForTimeout(1200);
    await expect(page.getByText("8", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: /01/ }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox").selectOption("aprovada");
    await dialog.getByPlaceholder("Ex.: Yan").fill("Yan");
    await page.keyboard.press("Escape");
    await expect(page.getByText("1", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Responsável: Yan")).toBeVisible();
  });
});

test.describe("Painel operacional", () => {
  test("abre o painel, alterna seções e edita contadores", async ({ page }) => {
    await page.goto("/painel");
    await page.getByLabel("Senha").fill("000000");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Senha incorreta.")).toBeVisible();
    await page.getByLabel("Senha").fill("258510");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("img", { name: "RUNZ" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Growth", exact: true }).locator("visible=true").first().click();
    await page.getByLabel("Usuários na lista VIP").fill("12");
    await page.getByRole("button", { name: "Visão geral", exact: true }).locator("visible=true").first().click();
    await expect(page.getByText("12", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Financeiro", exact: true }).locator("visible=true").first().click();
    await expect(page.getByText("MRR projetado M12")).toBeVisible();
    await page.getByRole("button", { name: "Execução", exact: true }).locator("visible=true").first().click();
    await expect(page.getByText("Visão de acompanhamento para Yan", { exact: false })).toBeVisible();
  });

  test("sem overflow horizontal nas páginas", async ({ page }) => {
    for (const url of ["/", "/#c11", "/#c15", "/painel"]) {
      await page.goto(url); await page.reload(); await page.waitForTimeout(1200);
      if (url === "/painel") { await page.getByLabel("Senha").fill("258510"); await page.getByRole("button", { name: "Entrar" }).click(); await page.waitForTimeout(600); }
      const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(over, `overflow horizontal em ${url}`).toBe(false);
    }
  });
});
