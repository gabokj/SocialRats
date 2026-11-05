# SocialRats — Design System

> Referência oficial de identidade visual do SocialRats.
> Versão: 1.0 · Fonte principal: captura da tela **Home** (`docs/design/reference-home.webp`).

## Como ler este documento

Cada regra vem com uma marcação de origem, para não confundir observação com sugestão:

| Marca | Significado |
|---|---|
| **[Observado]** | Característica visível na imagem de referência da Home. |
| **[Proposto]** | Valor ou regra sugerida por este documento. É configurável e deve ser validado visualmente contra a referência. |
| **[A definir]** | Ainda não decidido. O agente deve pedir confirmação antes de inventar. |

**Importante:** nenhum valor numérico (cor, tamanho, espaçamento) foi medido com precisão matemática a partir da imagem. Todos são aproximações tratadas como **tokens configuráveis**. Se o projeto já possuir tokens, variáveis ou temas, os valores existentes prevalecem e este documento deve ser atualizado para refletir isso.

Este documento é independente de framework. Nada aqui assume que o projeto usa React, Flask, HTML/CSS puro ou qualquer outra tecnologia. Os tokens são mostrados em formato CSS apenas como representação; traduza-os para o mecanismo que o projeto realmente utiliza.

---

## 1. Objetivo e escopo

**Objetivo.** Garantir que todas as telas do SocialRats (Home, Buscar, Métricas, Direct, Perfil e telas futuras como Configurações, Notificações e Edição de perfil) pareçam pertencer ao mesmo produto, sem que a identidade visual precise ser explicada de novo a cada solicitação.

**Escopo.** Este documento define apenas a camada visual e de interação: cores, gradientes, tipografia, espaçamentos, bordas, ícones, mídia, componentes, estados, acessibilidade e regras de composição de telas.

**Fora do escopo.** Regras de negócio, funcionalidades do produto, arquitetura de código e escolha de tecnologias. As listas de "pode conter" deste documento são orientações de interface, **não autorização para implementar funcionalidades não solicitadas**.

---

## 2. Referência visual oficial

- Arquivo: `docs/design/reference-home.webp` (a imagem fornecida da tela Home).
- A imagem é a referência visual principal. Em caso de dúvida sobre aparência, ela prevalece sobre qualquer descrição textual aqui.
- A imagem mostra um mockup de celular; o aplicativo em si é a área interna da moldura. A moldura do aparelho e o brilho roxo ao redor **não** fazem parte da interface.

**Elementos visíveis na referência [Observado]:**

1. Cabeçalho com a marca "SocialRats" em texto com gradiente (laranja → rosa → roxo) à esquerda e ícone de sino com indicador de notificação à direita.
2. Faixa horizontal de stories com avatares circulares, anel em gradiente e legenda de usuário abaixo. O primeiro item ("Your story") tem um pequeno botão "+" rosa sobreposto.
3. Feed de cards de publicação, cada um em superfície escura com borda fina e cantos arredondados.
4. Cabeçalho de publicação: avatar pequeno circular, nome de usuário em destaque, tempo relativo em texto secundário ("1 hour ago", "2 hours ago") e menu de três pontos à direita.
5. Mídia com cantos arredondados (imagem azul/laranja, imagem de pôr do sol) e indicador de página em pontos, com o ponto ativo em gradiente.
6. Linha de ações com ícones e contadores (curtir, comentar, repostar e um ícone à direita, ex.: salvar/compartilhar). O ícone de curtir aparece preenchido com cor de destaque.
7. Texto da publicação em cor clara, com o link "more" em cor de destaque ao final do texto truncado.
8. Publicação apenas com texto (sem mídia), usando a mesma estrutura de card.
9. Botão de ação flutuante circular com gradiente rosa/laranja e ícone de lápis, no canto inferior direito, acima da navegação.
10. Barra de navegação inferior com cinco abas: Home, Buscar, Métricas, Direct, Perfil. A aba ativa (Home) usa cor de destaque em ícone e rótulo; as inativas usam branco/cinza claro.

---

## 3. Princípios fundamentais

1. **Escuro primeiro.** Fundo quase preto com nuance de roxo; o conteúdo se destaca pela luz, não por caixas pesadas.
2. **Cor é sinal, não decoração.** Rosa, roxo e laranja aparecem para indicar marca, seleção, ação principal ou novidade. Em uma tela, a maior parte da área deve ser neutra escura.
3. **Compacto e mobile.** Densidade de informação alta, alvos de toque confortáveis, nada de elementos grandes sem necessidade.
4. **Premium sem excesso.** Bordas finas, brilho sutil, poucos efeitos. Se um efeito não comunica algo, remova.
5. **Consistência acima de novidade.** Uma nova tela deve usar os mesmos componentes e tokens. Estrutura pode variar conforme a função; linguagem visual não.
6. **O feed é referência de linguagem, não de estrutura.** Buscar, Métricas, Direct e Perfil herdam cores, cards, avatares e tipografia da Home, mas **não** precisam reproduzir um feed.

---

## 4. Paleta de cores e tokens

### 4.1 Cores base **[Proposto, validar contra a referência]**

| Token | Valor inicial | Uso |
|---|---|---|
| `color.background` | `#0B0913` | Fundo principal de todas as telas |
| `color.surface` | `#14111E` | Cards, painéis, barra de navegação |
| `color.surface-elevated` | `#1C1728` | Elementos elevados: modais, menus, campos em foco, chips |
| `color.border-subtle` | `#30263E` | Bordas finas de cards e divisórias |
| `color.text-primary` | `#FFFFFF` | Títulos, nomes de usuário, conteúdo principal |
| `color.text-secondary` | `#B7B0C5` | Metadados, tempo, legendas, rótulos inativos |
| `color.accent-pink` | `#FF32B8` | Ação principal, seleção, links de destaque (ex.: "more"), curtir |
| `color.accent-purple` | `#923BFF` | Destaque secundário, fim do gradiente, gráficos |
| `color.accent-orange` | `#FF713F` | Início do gradiente, identidade da marca |

### 4.2 Cores semânticas **[A definir]**

Os valores abaixo são **sugestões iniciais** que precisam de confirmação. Eles existem para que estados de sucesso, aviso e erro não reutilizem rosa/laranja (que já têm significado de marca).

| Token | Sugestão | Uso |
|---|---|---|
| `color.success` | `#34D399` | Confirmações, ações concluídas |
| `color.warning` | `#FBBF24` | Alertas não críticos |
| `color.error` | `#FF4D6D` | Erros, ações destrutivas |
| `color.info` | `#60A5FA` | Informações neutras (opcional) |

Regra: `color.error` deve ser distinguível de `color.accent-pink` por ícone e texto, nunca apenas por cor.

### 4.3 Tokens derivados (recomendados)

| Token | Uso |
|---|---|
| `color.text-disabled` | Texto desabilitado (secundário com opacidade reduzida) |
| `color.overlay` | Fundo de modais (preto com opacidade ~60%) |
| `color.focus-ring` | Anel de foco de teclado (rosa ou branco; ver seção 16) |
| `color.accent-pink-soft` | Fundo translúcido de badge/chip selecionado (rosa com baixa opacidade) |

### 4.4 Representação em CSS (ilustrativa)

```css
:root {
  --color-background: #0b0913;
  --color-surface: #14111e;
  --color-surface-elevated: #1c1728;
  --color-border-subtle: #30263e;
  --color-text-primary: #ffffff;
  --color-text-secondary: #b7b0c5;
  --color-accent-pink: #ff32b8;
  --color-accent-purple: #923bff;
  --color-accent-orange: #ff713f;
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-error: #ff4d6d;
}
```

### 4.5 Regras de uso das cores

- **Fundo e superfícies** ocupam a maior parte da tela. Nunca use rosa, roxo ou laranja como fundo de área grande.
- **No máximo um ponto de destaque dominante por viewport** (ex.: o botão flutuante OU um botão primário grande), com pequenos acentos adicionais permitidos (aba ativa, contador, badge).
- **Texto sobre fundo escuro:** use `text-primary` para o que importa e `text-secondary` para apoio. Não use cores de destaque para parágrafos.
- **Não invente novas cores de marca.** Se uma tela exigir uma cor nova (ex.: categorias em um gráfico), derive-a da paleta (variações de roxo/rosa/laranja) ou solicite aprovação.
- **Nunca** comunique estado só por cor (ver seção 16).

---

## 5. Gradientes

### 5.1 Gradiente da marca **[Observado, valores propostos]**

Transição de **laranja → rosa → roxo**, da esquerda para a direita no logotipo.

```css
:root {
  --gradient-brand: linear-gradient(90deg, #ff713f 0%, #ff32b8 55%, #923bff 100%);
  --gradient-brand-diagonal: linear-gradient(135deg, #ff713f 0%, #ff32b8 55%, #923bff 100%);
}
```

### 5.2 Onde usar

| Uso | Observado na referência? |
|---|---|
| Logotipo "SocialRats" | Sim |
| Anel de avatares em stories | Sim |
| Botão de ação flutuante (variação rosa/laranja) | Sim |
| Ponto ativo do indicador de carrossel | Sim |
| Ícone e rótulo da aba ativa | Sim (cor de destaque; gradiente opcional) |
| Botão primário de telas novas | Proposto |
| Barra de progresso, indicador de seleção em filtros | Proposto |

### 5.3 Onde **não** usar

- Fundos de cards, listas ou telas inteiras.
- Parágrafos de texto ou metadados.
- Mais de um elemento grande com gradiente na mesma região da tela.
- Bordas de todos os cards (reserve para itens selecionados ou em destaque).
- Sobre outro gradiente.

---

## 6. Tipografia

**Família.** A fonte original da referência **não foi identificada** e não deve ser inventada. Se o projeto já define uma fonte compatível, **preserve-a**. Caso contrário, **recomenda-se** uma sans-serif moderna e legível (ex.: Inter, Poppins ou Manrope), carregada com fallback para `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. A escolha final deve ser registrada aqui quando decidida.

```css
:root {
  --font-family-base: /* [A definir] */ system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

### 6.1 Hierarquia **[Proposto]**

| Papel | Tamanho | Peso | Cor | Exemplo no SocialRats |
|---|---|---|---|---|
| Marca/Logotipo | 24–28 px | 800 (extra bold) | gradiente da marca | "SocialRats" no cabeçalho |
| Título de tela | 22–24 px | 700 | `text-primary` | "Buscar", "Métricas" |
| Título de seção | 16–18 px | 600–700 | `text-primary` | "Perfis sugeridos" |
| Nome de usuário | 14–15 px | 600–700 | `text-primary` | "rijalxp" |
| Texto de conteúdo | 13–14 px | 400 | `text-primary` | Texto de uma publicação |
| Metadados | 12 px | 400 | `text-secondary` | "1 hour ago" |
| Legenda | 11–12 px | 400–500 | `text-secondary` | Nome sob avatar de story |
| Botão | 14–15 px | 600 | contraste com o fundo do botão | "Seguir" |
| Campo de formulário | 14–16 px | 400 | `text-primary` (placeholder em `text-secondary`) | Campo de pesquisa |
| Rótulo da navegação | 10–11 px | 500 | `text-secondary` / destaque quando ativa | "Home", "Buscar" |

### 6.2 Regras

- Altura de linha: ~1,4–1,5 para texto corrido; ~1,2 para títulos.
- Não use mais de **três pesos** diferentes por tela.
- Textos longos em cards devem ser truncados com "more" em `accent-pink` (padrão observado).
- Campos de entrada em dispositivos móveis devem usar **16 px** para evitar zoom automático em alguns navegadores.
- Nunca use texto abaixo de 10 px.

---

## 7. Escala de espaçamentos

Base de **4 px**. Valores **[Proposto]**, tratados como tokens.

| Token | Valor | Uso típico |
|---|---|---|
| `space.1` | 4 px | Espaço mínimo entre ícone e contador |
| `space.2` | 8 px | Entre ícone e texto, entre avatares de story |
| `space.3` | 12 px | Espaçamento interno compacto, entre ações |
| `space.4` | 16 px | Padding padrão de card, margem lateral |
| `space.5` | 20 px | Entre grupos dentro de uma seção |
| `space.6` | 24 px | Entre seções |
| `space.8` | 32 px | Entre blocos grandes |
| `space.10` | 40 px | Respiro de topo/rodapé em telas vazias |

### 7.1 Orientações

| Aspecto | Valor sugerido |
|---|---|
| Margem lateral da tela | 12–16 px |
| Distância entre cards em lista | 8–12 px |
| Distância entre seções | 20–24 px |
| Padding interno de card | 12–16 px |
| Espaço entre ícone e texto | 6–8 px |
| Altura de botão principal | 44–48 px |
| Altura de botão compacto | 32–36 px |
| Altura de campo de formulário/pesquisa | 44–48 px |
| Alvo de toque mínimo | 44 × 44 px |
| Tamanho de ícone padrão | 20–24 px |
| Tamanho de ícone pequeno (contadores) | 16–18 px |
| Avatar de story | 56–64 px (sem anel) |
| Avatar de cabeçalho de publicação | 32–40 px |
| Avatar de perfil (grande) | 80–96 px |
| Altura da barra de navegação | 56–64 px (+ área segura inferior) |
| Botão flutuante | 48–56 px |

---

## 8. Bordas, arredondamentos e sombras

### 8.1 Raios **[Proposto]**

| Token | Valor | Uso |
|---|---|---|
| `radius.sm` | 8 px | Chips pequenos, badges |
| `radius.md` | 12 px | Campos, botões, mídia dentro de cards |
| `radius.lg` | 16–20 px | Cards, painéis |
| `radius.xl` | 24 px | Modais, bottom sheets |
| `radius.full` | 9999 px | Avatares, botão flutuante, pílulas |

### 8.2 Bordas

- Espessura padrão: **1 px** em `color.border-subtle` **[Observado: bordas finas e discretas]**.
- Item selecionado/destacado: borda 1–2 px com gradiente da marca ou `accent-pink`.
- Evite bordas grossas ou de cor forte em elementos comuns.

### 8.3 Sombras e brilho

- A referência não depende de sombras fortes. O que separa camadas é a diferença de tom entre `background`, `surface` e `surface-elevated`.
- Brilho neon (glow) em rosa/roxo é permitido **apenas** em elementos de destaque (botão flutuante, item selecionado) e com baixa intensidade, por exemplo:

```css
--shadow-glow-pink: 0 0 16px rgba(255, 50, 184, 0.35);
--shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.45);
```

- Nunca aplique glow em vários elementos simultaneamente nem em texto corrido.

---

## 9. Ícones

- Estilo **[Observado]**: minimalista, de traço (outline), com cantos arredondados. O ícone de curtir aparece preenchido quando ativo.
- Use **uma única biblioteca/família de ícones** no projeto. A biblioteca utilizada pela referência não é conhecida; se o projeto já usa uma, mantenha-a.
- Tamanhos: 20–24 px (padrão), 16–18 px (junto a contadores).
- Cor padrão: `text-secondary` ou `text-primary`; ativo/selecionado: `accent-pink` (ou gradiente).
- Ícones que funcionam como botões devem ter alvo de toque de pelo menos 44 × 44 px e um rótulo acessível.
- Não misture ícones outline e sólidos para o mesmo conceito, exceto para indicar estado (ex.: curtir inativo → ativo).
- Ícones nunca devem ser o único meio de comunicar algo crítico; acompanhe com rótulo ou texto acessível.

---

## 10. Imagens, avatares e mídia

### 10.1 Avatares **[Observado]**

- Sempre **circulares**.
- Em stories: anel em **gradiente da marca** separado do avatar por um pequeno espaço (2–3 px) na cor de fundo.
- Story do próprio usuário: sem anel colorido obrigatório; botão "+" circular rosa sobreposto no canto inferior direito.
- Fallback quando não há foto: círculo em `surface-elevated` com iniciais em `text-primary`. **[Proposto]**

### 10.2 Mídia em publicações **[Observado]**

- Imagens com cantos arredondados (`radius.md` a `radius.lg`), ocupando a largura do card.
- Proporção: manter a proporção da mídia dentro de limites (ex.: entre 4:5 e 16:9). Cortar com `object-fit: cover`.
- Carrossel de várias mídias: indicador em pontos abaixo da imagem; ponto ativo em gradiente, inativos em cinza.
- Imagens devem ter `alt` descritivo (ver seção 16) e estado de carregamento (seção 15).

### 10.3 Regras

- Não aplicar filtros, molduras ou bordas decorativas nas imagens dos usuários.
- Texto sobreposto a imagens deve ter contraste garantido (use escurecimento/degradê escuro por baixo).

---

## 11. Hierarquia visual

Ordem de destaque (do mais ao menos forte):

1. **Ação principal da tela** (botão com gradiente / botão flutuante).
2. **Conteúdo principal** (mídia, títulos, nomes).
3. **Conteúdo de apoio** (texto de legenda, contadores).
4. **Metadados** (tempo, rótulos inativos).
5. **Estrutura** (bordas, divisórias, superfícies).

Regras:

- Uma tela deve ter **uma** ação principal clara.
- Use tamanho, peso e cor (nessa ordem) para criar hierarquia; evite depender só da cor.
- Agrupe conteúdo relacionado em cards; separe grupos distintos com espaço, não com linhas pesadas.

---

## 12. Layout e responsividade

- **Mobile first.** A referência é uma tela de celular em retrato (~390 px de largura de design). Projete primeiro para 360–430 px.
- Conteúdo em coluna única, com margem lateral de 12–16 px.
- Em telas maiores (tablet/desktop), **não esticar** o conteúdo: centralize a coluna do app com largura máxima (sugestão: 480–600 px) ou adote layout adaptado quando solicitado. A decisão para desktop é **[A definir]**.
- Respeite áreas seguras (notch, barra inferior do sistema) com `env(safe-area-inset-*)` quando aplicável.
- O conteúdo rolável deve ter padding inferior suficiente para não ficar escondido sob a navegação e o botão flutuante.
- Cabeçalho e navegação inferior permanecem fixos; apenas o conteúdo rola.
- Orientação paisagem: não deve quebrar o layout; não exige design dedicado, a menos que solicitado.

---

## 13. Barra de navegação inferior

**Status:** presente na referência **[Observado]**; implementação no código **[não presumida]**.

- Cinco abas fixas, nesta ordem: **Home, Buscar, Métricas, Direct, Perfil**.
- Cada aba: ícone (20–24 px) acima de rótulo curto (10–11 px).
- Superfície: `color.surface`, com borda superior fina em `border-subtle`.
- **Aba ativa [Observado]:** ícone e rótulo em cor de destaque (rosa/laranja; gradiente opcional). **Inativas:** `text-secondary`/branco suave.
- A barra é **idêntica em todas as abas**: mesma ordem, mesmos ícones, mesma altura. Nunca criar navegação diferente por tela.
- Telas secundárias (ex.: Configurações, conversa aberta) podem ocultar a barra apenas se isso for uma decisão explícita e consistente para toda a categoria de tela.
- Indicadores de novidade (ex.: mensagens não lidas no Direct) usam badge compacto (seção 14).
- Cada item tem alvo de toque ≥ 44 px, `aria-label`/nome acessível e `aria-current="page"` (ou equivalente) na aba ativa.

---

## 14. Componentes compartilhados

Legenda de status: **Observado** = aparece na referência; **Recomendado** = proposto por este documento. **Nenhum componente deve ser presumido como já implementado.** Ao trabalhar no código, verifique o que existe e use os nomes e convenções reais do projeto.

### 14.1 Cabeçalho da aplicação — *Observado*

- **Finalidade:** identificar a marca e dar acesso a notificações.
- **Aparência:** logotipo "SocialRats" com gradiente à esquerda; ícone de sino à direita com indicador (ponto rosa) quando há notificações.
- **Tokens:** `background`, `gradient-brand`, `accent-pink`, `space.4`.
- **Variações:** cabeçalho de aba principal (logotipo) e cabeçalho de tela secundária (botão voltar + título) *[Recomendado]*.
- **Estados:** com/sem notificação; foco do botão de sino.
- **Reutilização:** mesmo componente em todas as abas principais; o logotipo não muda de tamanho entre telas.

### 14.2 Navegação inferior — *Observado*
Ver seção 13.

### 14.3 Botão principal — *Recomendado*

- **Finalidade:** ação mais importante da tela (ex.: "Seguir", "Salvar", "Enviar").
- **Aparência:** fundo em `gradient-brand` (ou `accent-pink` sólido), texto branco, `radius.full` ou `radius.md`, altura 44–48 px.
- **Variações:** padrão, compacto (32–36 px), largura total.
- **Estados:** padrão, hover (clareia levemente), pressionado (escurece/escala 0,98), foco (anel), desabilitado (opacidade reduzida, sem glow), carregando (spinner substituindo/acompanhando o texto).
- **Regra:** no máximo um botão principal por região visível.

### 14.4 Botão secundário — *Recomendado*

- **Aparência:** fundo transparente ou `surface-elevated`, borda 1 px `border-subtle` ou `accent-pink`, texto `text-primary`.
- **Uso:** ações alternativas (ex.: "Mensagem", "Cancelar").
- **Estados:** mesmos do botão principal.

### 14.5 Botão de ícone — *Observado (sino, três pontos, ações do card)*

- **Aparência:** ícone de 20–24 px, área de toque ≥ 44 px, sem fundo por padrão.
- **Estados:** padrão, ativo (ex.: curtir preenchido em `accent-pink`), foco, desabilitado.
- **Regra:** sempre com rótulo acessível.

### 14.6 Botão de ação flutuante — *Observado*

- **Finalidade:** ação de criação principal (na Home, criar publicação, representada por um lápis).
- **Aparência:** círculo de 48–56 px, gradiente rosa/laranja, ícone branco, glow sutil, posicionado no canto inferior direito acima da navegação.
- **Regra:** use somente em telas onde exista uma ação de criação principal. Não adicionar em todas as abas por padrão. Não pode cobrir conteúdo essencial.

### 14.7 Campo de pesquisa — *Recomendado*

- **Aparência:** altura 44–48 px, `surface-elevated`, `radius.full` ou `radius.md`, borda `border-subtle`, ícone de lupa à esquerda, placeholder em `text-secondary`.
- **Estados:** padrão, foco (borda em `accent-pink`/gradiente), preenchido (botão de limpar), carregando, desabilitado.

### 14.8 Campo de formulário — *Recomendado*

- **Aparência:** igual ao campo de pesquisa, com rótulo visível acima, texto de ajuda opcional abaixo.
- **Estados:** padrão, foco, preenchido, erro (borda e mensagem em `error`, com ícone), sucesso, desabilitado.
- **Regra:** o erro deve ser comunicado também por texto, não só por cor.

### 14.9 Avatar — *Observado*
Ver seção 10. Variações: story (com anel), cabeçalho de publicação (pequeno), lista (médio), perfil (grande), com badge "+" (próprio story) ou indicador de presença *[Recomendado, somente se a funcionalidade existir]*.

### 14.10 Card de usuário — *Recomendado*

- **Finalidade:** exibir um perfil em listas (Buscar, perfis sugeridos, seguidores).
- **Aparência:** `surface`, borda `border-subtle`, avatar à esquerda, nome em `text-primary` e identificador em `text-secondary`, ação (botão compacto) à direita.
- **Estados:** padrão, pressionado, seguindo/não seguindo (conforme funcionalidade).

### 14.11 Card de publicação — *Observado*

- **Finalidade:** exibir uma publicação do feed ou do perfil.
- **Aparência:** `surface`, borda 1 px `border-subtle`, `radius.lg`, padding 12–16 px. Estrutura de cima para baixo: cabeçalho (avatar, nome, tempo, menu) → mídia opcional (com indicador de carrossel) → linha de ações com contadores → texto com truncamento ("more").
- **Variações:** com mídia, apenas texto *(ambas observadas)*, com carrossel.
- **Estados:** curtido/não curtido, texto expandido/recolhido, carregando (skeleton), erro de mídia.
- **Regra:** a estrutura interna não muda entre feed e perfil; apenas o contexto.

### 14.12 Cabeçalho de seção — *Recomendado*

- **Aparência:** título de seção (16–18 px, 600–700) à esquerda e ação opcional ("Ver tudo") em `accent-pink` à direita.
- **Regra:** use para dividir conteúdos em Buscar, Métricas e Perfil; evite criar títulos com estilos novos.

### 14.13 Filtros e seletores — *Recomendado*

- **Aparência:** chips/pílulas (`radius.full`), altura 32–36 px. Inativo: `surface-elevated` com borda `border-subtle` e texto `text-secondary`. Ativo: fundo `accent-pink-soft` com borda/texto em `accent-pink` ou preenchimento em gradiente.
- **Variações:** chip único, grupo de seleção única, grupo de seleção múltipla, abas segmentadas (ex.: período em Métricas).
- **Estados:** padrão, ativo, pressionado, foco, desabilitado.
- **Regra:** a seleção deve ser visível por mais que cor (ex.: peso do texto, ícone de check).

### 14.14 Indicadores e badges — *Observado (ponto de notificação, contadores)*

- **Aparência:** ponto de 8–10 px ou pílula compacta com número, em `accent-pink` (ou `error` para alertas críticos), texto branco 10–11 px.
- **Regra:** números altos devem ser abreviados ("99+"); não usar mais de um tipo de badge por item.

### 14.15 Modais e diálogos — *Recomendado*

- **Aparência:** `surface` / `surface-elevated`, `radius.xl` (24 px), `color.overlay` ao fundo, `shadow-elevated`. Título, descrição curta, ações (secundário à esquerda/abaixo, principal à direita/acima).
- **Variações:** diálogo de confirmação, bottom sheet (menu de três pontos de uma publicação), modal de formulário e **Modal de Criação de Publicação (Composer)**.
- **Modal de Criação de Publicação (Composer):**
  - **Cabeçalho:** avatar circular (52 px) com borda `accent-pink` à esquerda, nome do usuário com seletor dropdown (`caret-down`), botão de fechar (`×`) à direita e filtros em pílula (`composer-pill-btn`, `radius.full`, altura 32 px, `surface-elevated` e `border-subtle`):
    1. *Visibilidade* (`👁 Publicar para qualquer ... ▾`): define quem pode ver a publicação.
    2. *Permissão de Comentários* (`💬 Comentários: qualquer ... ▾`): define quem pode comentar.
  - **Filtro de Destino no mesmo padrão visual (`composer-pill-btn`):** pílula dropdown `Destino: Conta em geral ▾` que abre o menu para escolher entre **Sua Conta em Geral** ou uma **Comunidade específica** (ex.: GymRats Elite, Programação Devs, Calistenia, Corredores da Madrugada, IA & Tecnologia).
  - **Área de texto:** limpa, ampla (`min-height: 150px`), placeholder `"Compartilhe suas ideias..."` em `text-secondary`.
  - **Barra de ferramentas inferior:** pílula `Revise` com borda `border-subtle` à esquerda, seguida pelos botões circulares de emoji, galeria de mídia, conquista/PR, mais opções (`+`) e, **ao lado do `+`**, a pílula `Adicionar colaboradores` seguindo o mesmo padrão de filtro.
  - **Rodapé separado por divisória (`border-subtle`):** botão circular de agendamento (relógio) e botão `Publicar` (desabilitado em `surface-elevated` quando vazio; ativo em `gradient-brand` quando preenchido).
- **Estados:** abrindo/fechando, foco preso dentro do modal, fechar com Esc/gesto, ação destrutiva usa `error`.
- **Acessibilidade:** `role="dialog"`, foco inicial no elemento correto, devolver foco ao fechar.

### 14.16 Estados de carregamento — *Recomendado*

- Prefira **skeletons** com a forma do conteúdo (card, avatar, linha de texto) em `surface-elevated` com leve animação de brilho.
- Spinner pequeno apenas para ações pontuais (botão enviando).
- Respeite `prefers-reduced-motion`.

### 14.17 Estados vazios — *Recomendado*

- Ícone simples + título curto + texto de apoio em `text-secondary` + (opcional) uma ação.
- Exemplo (Buscar sem resultados): "Nenhum resultado para 'termo'" + sugestão de ajustar a busca.
- Tom de voz amigável e direto, sem humor excessivo.

### 14.18 Estados de erro — *Recomendado*

- Mensagem clara do que houve e o que fazer, ícone, botão "Tentar novamente".
- Cor `error` apenas para ícone/realce; texto principal continua em `text-primary`.
- Não expor mensagens técnicas ao usuário.

### 14.19 Mensagens de sucesso — *Recomendado*

- Toast/snackbar temporário (3–4 s) em `surface-elevated` com ícone e realce em `success`, posicionado acima da navegação inferior.
- Deve ser anunciado a leitores de tela (`role="status"`).

---

## 15. Estados de interação

| Estado | Regra visual |
|---|---|
| Padrão | Aparência base do componente |
| Hover (ponteiro) | Leve clareamento da superfície ou do texto; sem mudanças de layout |
| Pressionado | Escurecer/escalar a ~0,97–0,98 e/ou superfície mais clara; resposta imediata |
| Foco (teclado) | Anel visível de 2 px (`focus-ring`) com 2 px de afastamento; nunca remover sem substituto |
| Ativo/selecionado | Cor de destaque + sinal adicional (peso, check, preenchimento) |
| Desabilitado | Opacidade reduzida (~40–50%), sem hover, sem glow, cursor padrão |
| Carregando | Skeleton ou spinner, controle desativado enquanto a ação ocorre |
| Erro | Cor `error` + ícone + texto |
| Sucesso | Cor `success` + ícone + texto |

Animações: curtas (150–250 ms), suaves, sem movimentos bruscos. Respeitar `prefers-reduced-motion`.

---

## 16. Acessibilidade

- **Contraste mínimo (WCAG AA):** 4,5:1 para texto normal e 3:1 para texto grande e componentes de interface. Verifique `text-secondary` sobre `surface` e `background`; se não atingir, clareie o token. Valores propostos aqui **não foram verificados com ferramenta de contraste** e devem ser conferidos.
- **Texto sobre gradiente:** use branco e confirme contraste nos trechos mais claros do gradiente.
- **Não depender só de cor** para indicar estado, seleção ou erro.
- **Alvos de toque** mínimos de 44 × 44 px.
- **Rótulos acessíveis** em botões de ícone, abas e campos; imagens de conteúdo com `alt`; imagens decorativas com `alt=""`.
- **Navegação por teclado** e foco visível em todos os elementos interativos; ordem lógica.
- **Semântica:** títulos hierárquicos, listas como listas, `aria-current` na aba ativa, `role="dialog"` em modais.
- **Movimento reduzido:** desativar ou reduzir animações com `prefers-reduced-motion`.
- **Zoom/tamanho de fonte:** layouts não devem quebrar com texto ampliado.

---

## 17. Regras para criação de novas telas

1. Identifique a **finalidade** da tela e a qual categoria ela pertence (aba principal, tela secundária, formulário, modal).
2. Consulte a seção da aba correspondente (seção 18) ou, para telas novas, as regras desta seção.
3. **Reutilize** componentes existentes antes de criar novos. Se criar, registre-o neste documento.
4. Use **apenas tokens** (cores, espaçamentos, raios, tipografia). Não use valores soltos "mágicos" no código quando existir um token equivalente.
5. Mantenha cabeçalho e navegação inferior consistentes com as demais abas.
6. Fundo `background`, conteúdo em `surface`, destaques com parcimônia (seções 4 e 5).
7. Implemente os estados relevantes: carregamento, vazio, erro e sucesso.
8. Garanta responsividade e acessibilidade (seções 12 e 16).
9. **Não copie o feed** quando a estrutura não fizer sentido para a função da tela.
10. **Não invente funcionalidades.** Implemente apenas o que foi pedido; o que está listado como "pode conter" é orientação de interface.

**Telas futuras** (Configurações, Notificações, Edição de perfil, formulários etc.) seguem as mesmas regras: a estrutura muda conforme a finalidade, mas cores, tipografia, componentes e linguagem visual permanecem os mesmos. Exemplos de padrões sugeridos:

- *Configurações:* lista de itens agrupados em cards com cabeçalhos de seção; itens com ícone, rótulo e controle (toggle/seta).
- *Notificações:* lista cronológica com avatar, texto, tempo em `text-secondary` e indicador de não lida.
- *Edição de perfil / Criação de comunidade:* formulário minimalista em `surface` com foto de perfil circular grande editável (`84 px`, `radius.full`, `object-fit: cover`, botão de upload e miniaturas de capa), campos limpos (`surface-elevated`, `border-subtle`, `46 px` de altura), chips de categoria (`radius.full`) sem excesso de emojis ou caixas de prévia artificiais, e um único botão principal (`gradient-brand`, `48 px`) ao final.

---

## 18. Especificações visuais das cinco abas

> As listas abaixo descrevem **o que a interface pode conter**. Não autorizam implementar funcionalidades que não foram solicitadas.

### 18.1 Home — referência principal

- Estrutura **[Observado]**: cabeçalho → faixa de stories → feed de cards de publicação → botão flutuante → navegação inferior.
- Preservar feed, stories, cards, interações e navegação conforme as funcionalidades do projeto.
- Esta é a tela que define a linguagem visual das demais.

### 18.2 Buscar

- **Prioridade:** pesquisa e descoberta.
- Pode conter: campo de pesquisa, filtros/categorias (chips), resultados, perfis sugeridos (card de usuário), estados sem resultado, carregamento e erro.
- Estrutura sugerida: cabeçalho → campo de pesquisa (fixo no topo da área de conteúdo) → chips de categoria → resultados em lista ou grade.
- Resultados de publicações podem usar o card de publicação; resultados de pessoas usam o card de usuário.
- **Não** reproduzir a faixa de stories nem o feed completo se não fizer sentido.
- Botão flutuante: normalmente **não** usado aqui.

### 18.3 Métricas

- **Prioridade:** apresentação de dados e estatísticas.
- Pode usar: cards de indicador (valor grande + rótulo + variação), gráficos, filtro de período (abas segmentadas), comparações, legendas, indicadores de evolução.
- **Gráficos:** fundo transparente ou `surface`; séries com a paleta do SocialRats (laranja, rosa, roxo e variações); eixos e grades em `border-subtle`/`text-secondary`; legendas legíveis (≥ 11 px); contraste suficiente; não depender só de cor (rótulos, padrões ou valores diretos).
- Indicadores de variação positiva/negativa: use `success`/`error` com ícone de seta e sinal (+/−).
- Mostrar estados de carregamento (skeleton do gráfico), vazio (sem dados no período) e erro.

### 18.4 Direct

- **Prioridade:** conversas e mensagens.
- Pode conter: lista de conversas, avatar, nome do contato, prévia da mensagem (uma linha, truncada, `text-secondary`), horário, indicador de não lidas (badge), busca de conversas, estados vazios e de carregamento.
- Conversa aberta (se solicitada): cabeçalho com voltar + avatar + nome; balões de mensagem (enviadas com destaque rosa/gradiente discreto, recebidas em `surface-elevated`); campo de mensagem fixo ao fim, acima da área segura.
- Conversas não lidas: nome e prévia em `text-primary` e com peso maior; lidas em `text-secondary`.

### 18.5 Perfil

- **Prioridade:** identidade do usuário e seu conteúdo.
- Pode conter: avatar grande, nome e identificador, biografia, estatísticas (contagens), ações do perfil (botão principal + secundário), publicações (lista ou grade), acesso a configurações ou opções adicionais se previstas.
- Estrutura sugerida: cabeçalho do perfil em card (`surface`) → estatísticas → ações → abas/segmentos de conteúdo → publicações (reutilizando o card de publicação ou miniaturas).

---

## 19. Critérios para avaliar a consistência visual

Uma tela está consistente quando:

- [ ] Usa apenas cores, espaçamentos, raios e tipografia definidos pelos tokens.
- [ ] Fundo e superfícies seguem `background`/`surface`/`surface-elevated`; destaques são raros e intencionais.
- [ ] Gradiente aparece apenas nos usos previstos (seção 5).
- [ ] Cabeçalho e navegação inferior são idênticos às demais abas.
- [ ] Componentes reutilizados em vez de duplicados; componentes novos documentados.
- [ ] Avatares circulares, mídia com cantos arredondados, bordas finas.
- [ ] Hierarquia clara: uma ação principal por tela.
- [ ] Estados de carregamento, vazio e erro tratados quando aplicável.
- [ ] Contraste e alvos de toque conferem com a seção 16.
- [ ] Nenhuma funcionalidade foi adicionada além do solicitado.
- [ ] Visualmente, a tela poderia ser colocada ao lado da Home sem parecer outro aplicativo.

Ao revisar, registre as inconsistências por categoria (cor, tipografia, espaçamento, componente, navegação, estado, acessibilidade) e corrija sem alterar o que não está relacionado.

---

## 20. Processo de atualização do Design System

1. **Fonte de verdade:** este arquivo, versionado no repositório. A imagem de referência fica em `docs/design/`.
2. **Quando atualizar:** ao adicionar um componente reutilizável, alterar um token, mudar a identidade visual ou decidir um item marcado como **[A definir]**.
3. **Como atualizar:** altere o documento **na mesma mudança** que altera o código; atualize o número de versão e o histórico abaixo.
4. **Decisões pendentes:** resolva os itens **[A definir]** (fonte, cores semânticas, comportamento em desktop) e remova a marcação.
5. **Validação:** ao ajustar valores propostos, compare com a imagem de referência e, se possível, meça com ferramenta de cor/contraste, registrando que o valor foi verificado.
6. **Nova referência visual:** se novas telas aprovadas forem adicionadas como referência, guarde-as em `docs/design/` e liste-as na seção 2.
7. Mudanças visuais não solicitadas por quem mantém o produto **não** devem ser feitas por agentes; proponha-as e aguarde aprovação.

### Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | — | Criação inicial a partir da referência da tela Home |
| 1.1 | 2026-10-30 | Padronização completa de tokens, componentes, dimensões e navegação entre todas as 5 abas (Home, Buscar, Métricas, Direct, Perfil) e telas de autenticação |
| 1.2 | 2026-11-01 | Padronização do Modal de Criação de Publicação (Composer) com seletor e filtro de destino (Conta Geral vs. Comunidades específicas), permissões de comentários, colaboradores e barra de ferramentas |

| 1.3 | 2026-11-05 | Direct: tela de informações da conversa, privacidade e segurança (`dm-screen`, `dm-list`/`dm-row`), bottom sheet de opções e modais de denúncia/bloqueio (`dm-overlay`/`dm-modal`). Estado em `SocialRatsUser.dm` (`socialrats_dm_settings_v1`). |
| 1.4 | 2026-11-05 | Direct: tela de informações simplificada; Personalizar marcado com selo PRO (`dm-pro-tag`) e modal de apresentação do Pro; tela Criar grupo (`dm-screen`, seleção em `dm-row` com `grp-user-check`). |
| 1.5 | 2026-11-05 | Stories unificados em todo o SocialRats (Feed, Direct, Chat, Perfil, Comunidades e Busca): engine centralizada (stories-engine.js), anel gradiente vibrante (has-story) para novos stories, anel cinza (#4b4958) para stories visualizados acessíveis por 24 horas, visualizador de stories unificado com navegação touch swipe, like, resposta via Direct e compartilhamento. |
| 1.6 | 2026-11-05 | Stories: Navegação contextual inteligente inspirada no Instagram. Contexto Direct (exclusivo do contato, sem avançar para outros), Contexto Perfil (exclusivo do autor do perfil) e Contexto Feed (sequência inteligente apenas de contas com stories não visualizados, excluindo contas já vistas da fila automática). |
