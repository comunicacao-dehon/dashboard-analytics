import { AnimatedCard } from "@/components/AnimatedCard";
import { TrendingUp, TrendingDown, Info, Download } from "lucide-react";

interface FormatItemProps {
  label: string;
  value: string;
  count?: string;
  trend?: string;
  positive?: boolean;
}

function FormatItem({ label, value, count, trend, positive = true }: FormatItemProps) {
  return (
    <div className="flex items-center justify-between group p-1.5 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</p>
        {count && <p className="text-xs font-bold text-foreground/40">{count}</p>}
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{value}</p>
        {trend && (
          <p className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

export function FacebookFormatAnalysis() {
  return (
    <AnimatedCard className="p-6 border-border/40">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
          <h3 className="font-bold text-lg tracking-tight">Principais formatos de conteúdo</h3>
        </div>
        <button className="flex items-center gap-2 text-xs font-bold bg-muted hover:bg-secondary px-3 py-1.5 rounded-lg border border-border transition-all">
          <Download className="w-3.5 h-3.5" />
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna 1: Conteúdo publicado */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Conteúdo publicado</p>
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground mb-4">Com base em até 200 conteúdos</p>
            <div className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase py-0.5 px-2 rounded-full inline-block mb-6 border border-emerald-500/20">
              +435,7% x 16 de fev de 2026...
            </div>
          </div>
          <div className="space-y-2">
            <FormatItem label="Stories" value="59" />
            <FormatItem label="Fotos" value="12" />
            <FormatItem label="Reels" value="3" />
            <FormatItem label="Ao vivo" value="1" />
          </div>
        </div>

        {/* Coluna 2: Visualizações */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Visualizações</p>
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase py-0.5 px-2 rounded-full inline-block mb-10 border border-emerald-500/20">
              +25,9% x 16 de fev de 2026...
            </div>
          </div>
          <div className="space-y-2">
            <FormatItem label="Foto" value="34.932" />
            <FormatItem label="Stories" value="8.292" />
            <FormatItem label="Reels" value="2.835" />
            <FormatItem label="Ao vivo" value="280" />
            <FormatItem label="Outros" value="52" />
          </div>
        </div>

        {/* Coluna 3: Interações */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Interações com o conteúdo</p>
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase py-0.5 px-2 rounded-full inline-block mb-10 border border-emerald-500/20">
              +59,0% x 16 de fev de 2026...
            </div>
          </div>
          <div className="space-y-2">
            <FormatItem label="Foto" value="1.237" />
            <FormatItem label="Stories" value="693" />
            <FormatItem label="Reels" value="213" />
            <FormatItem label="Ao vivo" value="34" />
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
