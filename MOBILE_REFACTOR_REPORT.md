# Relatório de refatoração mobile

## Principais mudanças

- Navegação mobile aplicada até `768px`, com menu hambúrguer, fechamento por `Escape` e fechamento automático ao retornar ao desktop.
- Alvos de toque ajustados para no mínimo `44px` no menu, alternância de tema, ações de perfil, chat e controles da timeline.
- Cursor customizado ocultado em dispositivos sem ponteiro fino, removendo o artefato no canto da tela.
- Animação lateral dos cards de projetos desativada apenas no fluxo mobile, evitando overflow transitório.
- Seções animadas passam a recortar overflow horizontal apenas até `768px`.
- Introdução pesada em Canvas não é montada em dispositivos mobile; o portfólio é exibido diretamente.
- Preload antecipado de Three.js, timeline e gráfico foi desativado no mobile. Essas seções continuam carregando sob demanda ao se aproximarem do viewport.
- Detecção mobile centralizada em `src/shared/lib/isMobileViewport.ts`.

## Breakpoints

- `<= 768px`: smartphone e tablet pequeno; menu compacto, áreas de toque de `44px`, contenção de overflow e carregamento progressivo.
- `>= 1024px`: regras visuais existentes mantidas. A navegação, dimensões dos controles e animações desktop não foram alteradas.
- `769px–1023px`: navegação compacta para evitar compressão dos links em tablets e notebooks estreitos.

## Decisões de design

- A introdução em partículas era o principal bloqueio de CPU no mobile. Ela foi preservada no desktop e removida no mobile para priorizar acesso imediato ao conteúdo.
- Os círculos de tema mantêm o tamanho visual original; somente sua área clicável cresce no mobile.
- Os cards de projeto mantêm fade, escala e blur no mobile, mas não usam deslocamento horizontal fora do viewport.

## Validação

- `npm run lint`: concluído sem erros ou warnings.
- `npm run build`: concluído com sucesso no Next.js 16.3.2.
- Chromium emulado em `320px`, `375px`, `768px` e `1024px`:
  - `scrollX = 0` após tentativa de rolagem horizontal;
  - nenhum controle interativo abaixo de `44px` entre `320px` e `768px`;
  - menu compacto até `768px` e menu desktop em `1024px`;
  - todas as seções carregadas e percorridas durante o teste.
- Lighthouse mobile em build de produção:
  - Performance: **90**
  - FCP: **1,3 s**
  - LCP: **3,3 s**
  - TBT: **180 ms**
  - CLS: **0**
  - Speed Index: **1,5 s**

## Componentes que originavam os problemas

- `ProjectPanel`: transform lateral dos cards inativos ampliava a área rolável.
- `CustomCursor`: elementos permaneciam visíveis em `(0, 0)` quando o efeito era desativado em touch.
- `Navbar`, `ThemeToggle`, `ProfileActions`, `ChatWidget` e `TimelineControls`: áreas de toque menores que `44px`.
- `HomeClient` e `useLazyLoadSections`: introdução em Canvas e preload das seções pesadas aumentavam o trabalho da main thread no mobile.
