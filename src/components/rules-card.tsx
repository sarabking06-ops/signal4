import { Shield, Target } from "lucide-react";

function Rule({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex gap-2 text-sm leading-6">
      <span className="num mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm bg-brass/15 text-xs text-brass">
        {n}
      </span>
      <span>{text}</span>
    </li>
  );
}

export function RulesCard() {
  return (
    <aside className="order-2 flex flex-col gap-4 rounded-md border border-line bg-surface p-4 lg:sticky lg:top-4 lg:order-1">
      <div>
        <p className="text-xs tracking-widest text-brass">قواعد قطعی</p>
        <h2 className="mt-1 text-lg font-semibold">استراتژی روند</h2>
        <p className="mt-1 text-sm text-muted">
          فقط کندل بسته‌شده ملاک است. کندل در حال تشکیل وارد سیگنال نمی‌شود.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-long">خرید</h3>
        <ol className="flex flex-col gap-2">
          <Rule n="۱" text="EMA ۵۰ بالاتر از EMA ۲۰۰ باشد و قیمت بالاتر از EMA ۲۰۰ بماند." />
          <Rule n="۲" text="قیمت پایانی از زیر EMA ۲۰ به بالای آن عبور کند." />
          <Rule n="۳" text="RSI با دورهٔ ۱۴ بالاتر از ۵۰ باشد." />
        </ol>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-short">فروش استقراضی</h3>
        <ol className="flex flex-col gap-2">
          <Rule n="۱" text="EMA ۵۰ پایین‌تر از EMA ۲۰۰ باشد و قیمت پایین‌تر از EMA ۲۰۰ بماند." />
          <Rule n="۲" text="قیمت پایانی از بالای EMA ۲۰ به زیر آن عبور کند." />
          <Rule n="۳" text="RSI با دورهٔ ۱۴ پایین‌تر از ۵۰ باشد." />
        </ol>
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-3 text-sm">
        <p className="flex items-start gap-2">
          <Shield className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden />
          <span>حد ضرر: ۱٫۵ برابر ATR دورهٔ ۱۴.</span>
        </p>
        <p className="flex items-start gap-2">
          <Target className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden />
          <span>حد سود: ۲ برابر فاصلهٔ حد ضرر. نسبت پاداش به ریسک ۲ به ۱.</span>
        </p>
        <p className="text-muted">
          ریسک هر معامله ۰٫۵٪ سرمایه است. حجم یک‌بار محاسبه می‌شود؛ افزایش پله‌ای و مارتینگل در این
          استراتژی جایی ندارد.
        </p>
      </div>
    </aside>
  );
}
