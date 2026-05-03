// ============================================================
//  TIMETABLE THEME COLOR SYNC
//  Reads the active DV theme color (Green/Violet/Blue/etc.)
//  and applies it as the primary color across all three
//  timetable pages: Configurator, Timetable View, Teacher Timetable
// ============================================================

(function dvTimetableThemeColor() {

    // ── Color map — matches _reset.scss SCSS variables exactly ──────
    const COLOR_MAP = {
        Green:  { primary: "#43a047", dark: "#2a7e2e", light: "#dff0e0", break: "#F9A825", breakDark: "#F57F17" },
        Blue:   { primary: "#007BFF", dark: "#0065cd", light: "#edf8ff", break: "#F9A825", breakDark: "#F57F17" },
        Red:    { primary: "#e53935", dark: "#be2724", light: "#ffd7d6", break: "#F9A825", breakDark: "#F57F17" },
        Orange: { primary: "#fb8c00", dark: "#d07706", light: "#ffe8c8", break: "#66BB6A", breakDark: "#388E3C" },
        Yellow: { primary: "#ffca28", dark: "#deae1b", light: "#fff2cd", break: "#F9A825", breakDark: "#F57F17" },
        Pink:   { primary: "#ec407a", dark: "#b92a5a", light: "#ffdde8", break: "#F9A825", breakDark: "#F57F17" },
        Violet: { primary: "#ab47bc", dark: "#773183", light: "#fbe0ff", break: "#F9A825", breakDark: "#F57F17" },
    };

    // ── Get current theme color ─────────────────────────────────────
    function getThemeColor() {
        // 1. From frappe.theme_settings (set by DV theme on boot)
        if (frappe.theme_settings && frappe.theme_settings.theme_color) {
            return frappe.theme_settings.theme_color;
        }
        // 2. Fallback: detect from body class e.g. dv-Violet-style
        const bodyClass = document.body.className;
        const match = bodyClass.match(/dv-(\w+)-style/);
        if (match) return match[1];
        // 3. Default
        return "Green";
    }

    // ── Inject dynamic CSS variables into :root ─────────────────────
    function applyTimetableColors() {
        const colorName = getThemeColor();
        const c = COLOR_MAP[colorName] || COLOR_MAP["Green"];

        // Remove old style tag if exists
        const oldStyle = document.getElementById("dv-tt-theme-colors");
        if (oldStyle) oldStyle.remove();

        const style = document.createElement("style");
        style.id = "dv-tt-theme-colors";
        style.textContent = `
            /* ── Timetable Configurator ── */
            .tt-corner,
            .tt-td-day          { background: ${c.dark}  !important; border-color: ${c.dark}  !important; }
            .tt-th-period,
            .tt-day-label       { background: ${c.primary} !important; border-color: ${c.dark} !important; }
            .tt-times-row th    { background: ${colorName === 'Yellow' ? c.dark : c.primary}CC !important; border-color: ${c.dark} !important; }
            .tt-cell-inner.filled { border-left-color: ${c.primary} !important; background: ${c.light} !important; }
            .tt-day-pill.on     { background: ${c.primary} !important; border-color: ${c.dark} !important; }
            .tt-day-pill:hover:not(.on) { border-color: ${c.primary} !important; color: ${c.dark} !important; }
            .tt-btn-primary     { background: ${c.primary} !important; border-color: ${c.dark} !important; }
            .tt-btn-primary:hover { background: ${c.dark} !important; }
            .tt-chip:hover      { box-shadow: 0 0 0 2px ${c.primary}40 !important; }
            .tt-cell-input-wrap .link-field input:focus { border-color: ${c.primary} !important; box-shadow: 0 0 0 2px ${c.primary}25 !important; }

            /* ── Timetable View (ed-time-table) ── */
            .tv-th-corner,
            .tv-td-day          { background: ${c.dark}  !important; border-color: ${c.dark}  !important; }
            .tv-th-period       { background: ${c.primary} !important; border-color: ${c.dark} !important; }
            .tv-th-brk          { background: ${c.break} !important; border-color: ${c.breakDark} !important; }
            .tv-td-brk          { color: ${c.breakDark} !important; }
            .tv-card            { border-left-color: ${c.primary} !important; background: ${c.light} !important; }

            /* ── Teacher Timetable (ed-teacher-timetable) ── */
            .ttv-corner,
            .ttv-td-day         { background: ${c.dark}  !important; border-color: ${c.dark}  !important; }
            .ttv-th-period      { background: ${c.primary} !important; border-color: ${c.dark} !important; }
            .ttv-th-brk         { background: ${c.break} !important; border-color: ${c.breakDark} !important; }
            .ttv-td-brk         { color: ${c.breakDark} !important; border-color: #ffe0b2 !important; }
            .ttv-card           { border-left-color: ${c.primary} !important; background: ${c.light} !important; }
            .ttv-card.ttv-add   { border-left-color: #9c27b0 !important; background: rgba(156,39,176,.06) !important; }
        `;
        document.head.appendChild(style);
    }

    // ── Run on page load and on every page change ───────────────────
    // DV theme may not have set frappe.theme_settings yet on first tick,
    // so we wait for it using the same 'page-change' hook pattern
    $(document).on("page-change", function () {
        const route = frappe.get_route_str();
        if (
            route.includes("ed-timetable-config") ||
            route.includes("ed-time-table") ||
            route.includes("ed-teacher-timetable")
        ) {
            // Small delay so DV theme finishes applying its own styles first
            setTimeout(applyTimetableColors, 150);
        }
    });

    // Also run immediately in case page already loaded
    setTimeout(applyTimetableColors, 300);

})();