/**
 * صحنه‌ی سه‌بعدی بخش اصلی: گوشی با رابط واقعی LINGO و عناصر شناور اطراف آن.
 * کاملاً با CSS ساخته شده (بدون تصویر و بدون جاوااسکریپت) تا سبک بماند.
 * استایل‌ها در globals.css با پیشوند lp- هستند.
 */
export default function HeroScene() {
  return (
    <div className="lp-stage" aria-hidden="true">
      <div className="lp-aura"></div>

      {/* ─── گوشی ─── */}
      <div className="lp-phone-wrap">
        <div className="lp-phone">
          <div className="lp-screen">
            <div className="lp-island"></div>

            <div className="lp-status">
              <span>۹:۴۱</span>
              <span className="lp-status-dots"><i></i><i></i><i></i></span>
            </div>

            <div className="lp-app">
              <div className="lp-app-head">
                <span className="lp-avatar">ع</span>
                <div className="lp-app-hello">
                  <b>سلام، دوست من</b>
                  <small>امروز هم آلمانی یاد بگیریم</small>
                </div>
                <img className="lp-app-logo" src="/images/logo-mark.webp" alt="" width="28" height="25" />
              </div>

              <div className="lp-word">
                <div className="lp-word-top">
                  <span className="lp-pill">واژه روز</span>
                  <span className="lp-pill lp-pill-ghost">A1</span>
                </div>
                <p className="lp-word-de" lang="de" dir="ltr">Willkommen</p>
                <p className="lp-word-fa">خوش آمدید</p>
                <div className="lp-word-foot" dir="ltr">
                  <span className="lp-play">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  <span>/ˈvɪlkɔmən/</span>
                </div>
              </div>

              <div className="lp-goal">
                <svg className="lp-goal-ring" viewBox="0 0 44 44" width="44" height="44">
                  <circle cx="22" cy="22" r="18" fill="none" strokeWidth="5" className="lp-ring-bg" />
                  <circle cx="22" cy="22" r="18" fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray="76.9 113.1" transform="rotate(-90 22 22)" className="lp-ring-fg" />
                </svg>
                <div>
                  <b>هدف امروز</b>
                  <small>۱۷ از ۲۵ واژه</small>
                </div>
                <span className="lp-goal-pct">۶۸٪</span>
              </div>

              <div className="lp-lessons">
                <div className="lp-lesson">
                  <span className="lp-lesson-ic lp-ic-1">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <div><b>سلام و احوال‌پرسی</b><small lang="de" dir="ltr">Hallo · Tschüss</small></div>
                </div>
                <div className="lp-lesson">
                  <span className="lp-lesson-ic lp-ic-2">۲</span>
                  <div><b>اعداد ۱ تا ۱۰</b><small lang="de" dir="ltr">eins · zwei · drei</small></div>
                </div>
                <div className="lp-lesson lp-lesson-dim">
                  <span className="lp-lesson-ic lp-ic-3">۳</span>
                  <div><b>در رستوران</b><small lang="de" dir="ltr">Die Speisekarte</small></div>
                </div>
              </div>
            </div>

            <div className="lp-tabbar"><i className="on"></i><i></i><i></i><i></i></div>
            <div className="lp-glare"></div>
          </div>
        </div>
      </div>

      {/* ─── عناصر شناور ─── */}
      <div className="lp-chip lp-flag">
        <div className="lp-chip-in lp-bob-a">
          <span className="lp-flag-bar lp-fl-1"></span>
          <span className="lp-flag-bar lp-fl-2"></span>
          <span className="lp-flag-bar lp-fl-3"></span>
        </div>
      </div>

      <div className="lp-chip lp-card lp-card-hallo">
        <div className="lp-chip-in lp-bob-b">
          <b lang="de" dir="ltr">Hallo</b>
          <small>سلام</small>
        </div>
      </div>

      <div className="lp-chip lp-card lp-card-danke">
        <div className="lp-chip-in lp-bob-c">
          <b lang="de" dir="ltr">Danke</b>
          <small>ممنون</small>
        </div>
      </div>

      <div className="lp-chip lp-card lp-card-morgen">
        <div className="lp-chip-in lp-bob-a">
          <b lang="de" dir="ltr">Guten Morgen</b>
          <small>صبح بخیر</small>
        </div>
      </div>

      <div className="lp-chip lp-mic">
        <div className="lp-chip-in lp-bob-c">
          <span className="lp-mic-ring"></span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
        </div>
      </div>

      <div className="lp-chip lp-ai">
        <div className="lp-chip-in lp-bob-b">
          <span className="lp-ai-ic">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" /></svg>
          </span>
          <div>
            <b>مربی هوشمند</b>
            <small>بیا مکالمه کنیم</small>
          </div>
          <span className="lp-typing"><i></i><i></i><i></i></span>
        </div>
      </div>

      <div className="lp-chip lp-streak">
        <div className="lp-chip-in lp-bob-a">
          <svg viewBox="0 0 44 44" width="46" height="46">
            <circle cx="22" cy="22" r="17" fill="none" strokeWidth="4.5" className="lp-ring-bg" />
            <circle cx="22" cy="22" r="17" fill="none" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="76.9 106.8" transform="rotate(-90 22 22)" className="lp-ring-fg lp-ring-glow" />
          </svg>
          <span>۷۲٪</span>
        </div>
      </div>
    </div>
  );
}
