/**
 * ISA SANTANA — PSICÓLOGA CLÍNICA (@psiisasantana)
 * JavaScript Modular para Interações, Acessibilidade e FAQ
 */

function initIsaApp() {

  // 1. Atualização automática do ano de copyright
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Accordion de Perguntas Frequentes (FAQ) — 100% FECHADO INICIALMENTE
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    // Garantir estado inicial fechado sem bugs de semi-abertura
    trigger.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-active');
    panel.style.display = 'none';

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fechar todos os outros itens
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.display = 'none';
        }
      });

      // Alternar o item atual
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('is-active');
        panel.style.display = 'none';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('is-active');
        panel.style.display = 'block';
      }
    });
  });

  // 3. Scroll Reveal Suave (Intersection Observer)
  const revealElements = document.querySelectorAll(
    '.hero-content, .trust-ribbon, ' +
    '.pillar-card, .online-topic-item, ' +
    '.about-visual, .about-content, .faq-item, .final-cta-card'
  );

  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Suavização de Rolagem para Âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 20;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4b. Dobra 3: Chat Interativo da TCC Acionado pelo Scroll Vertical
  function initTccChatScroll() {
    const pinWrapper = document.getElementById('philosophyPinWrapper');
    if (!pinWrapper) return;

    const msg1 = document.getElementById('tcc-msg-1');
    const typing = document.getElementById('tcc-typing');
    const msg2 = document.getElementById('tcc-msg-2');
    const msg3 = document.getElementById('tcc-msg-3');
    const msg4 = document.getElementById('tcc-msg-4');

    if (!msg1 || !typing || !msg2 || !msg3 || !msg4) return;

    function setElementState(el, opacity, translateY) {
      if (!el) return;
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    }

    function updateChatOnScroll() {
      const rect = pinWrapper.getBoundingClientRect();
      const scrollDist = pinWrapper.offsetHeight - window.innerHeight;
      if (scrollDist <= 0) return;

      const scrolled = -rect.top;
      let progress = scrolled / scrollDist;
      progress = Math.max(0, Math.min(1, progress));

      // 1. Mensagem 1 (Cliente) surge entre 0.04 e 0.18
      let p1 = Math.max(0, Math.min(1, (progress - 0.04) / 0.14));
      setElementState(msg1, p1, (1 - p1) * 20);

      // 2. Indicador Digitando surge entre 0.18 e 0.34
      let typingOpacity = 0;
      let typingScale = 0.9;
      if (progress >= 0.18 && progress < 0.25) {
        typingOpacity = (progress - 0.18) / 0.07;
        typingScale = 0.9 + typingOpacity * 0.1;
      } else if (progress >= 0.25 && progress <= 0.30) {
        typingOpacity = 1;
        typingScale = 1;
      } else if (progress > 0.30 && progress <= 0.36) {
        typingOpacity = 1 - (progress - 0.30) / 0.06;
        typingScale = 0.9 + typingOpacity * 0.1;
      }
      typing.style.opacity = Math.max(0, Math.min(1, typingOpacity)).toFixed(3);
      typing.style.transform = `scale(${typingScale.toFixed(2)})`;
      typing.style.display = progress > 0.38 ? 'none' : 'flex';

      // 3. Mensagem 2 (Profissional) surge entre 0.32 e 0.46
      let p2 = Math.max(0, Math.min(1, (progress - 0.32) / 0.14));
      setElementState(msg2, p2, (1 - p2) * 20);

      // 4. Mensagem 3 (Profissional) surge entre 0.50 e 0.64
      let p3 = Math.max(0, Math.min(1, (progress - 0.50) / 0.14));
      setElementState(msg3, p3, (1 - p3) * 20);

      // 5. Mensagem 4 (Profissional - final) surge entre 0.68 e 0.82
      let p4 = Math.max(0, Math.min(1, (progress - 0.68) / 0.14));
      setElementState(msg4, p4, (1 - p4) * 20);
    }

    // Inicialização imediata
    updateChatOnScroll();

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateChatOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateChatOnScroll);
    window.addEventListener('load', updateChatOnScroll);
  }

  initTccChatScroll();

  // 5. Dobra 5: Animação da Linha SVG de Jornada e Revelação Progressiva dos Cards
  const pinWrapper = document.getElementById('processPinWrapper');
  const stickyContent = document.getElementById('processStickyContent');
  const journeyLineFill = document.getElementById('journeyLineFill');
  const journeySpark = document.getElementById('journeySpark');
  const journeySvgWrapper = document.getElementById('journeySvgWrapper');
  const stepsTimeline = document.getElementById('stepsTimeline');
  const stepItems = document.querySelectorAll('.step-v-item');
  const practicalBanner = document.getElementById('sessionPracticalBanner');

  if (pinWrapper && stickyContent && journeyLineFill && stepsTimeline && stepItems.length >= 3) {
    // Alinhar a posição física do SVG exatamente entre o centro do badge 01 e o centro do badge 03
    function updateSvgPositions() {
      const badge1 = stepItems[0].querySelector('.step-v-badge');
      const badge3 = stepItems[2].querySelector('.step-v-badge');
      if (badge1 && badge3 && journeySvgWrapper) {
        const rect1 = badge1.getBoundingClientRect();
        const rect3 = badge3.getBoundingClientRect();
        const timelineRect = stepsTimeline.getBoundingClientRect();

        const startY = (rect1.top + rect1.height / 2) - timelineRect.top;
        const endY = (rect3.top + rect3.height / 2) - timelineRect.top;
        const centerX = (rect1.left + rect1.width / 2) - timelineRect.left;

        journeySvgWrapper.style.top = `${startY}px`;
        journeySvgWrapper.style.height = `${endY - startY}px`;
        journeySvgWrapper.style.left = `${centerX - 2}px`;
      }
    }

    function updateJourneyProgress() {
      const rect = pinWrapper.getBoundingClientRect();
      const scrollDist = pinWrapper.offsetHeight - window.innerHeight;

      if (scrollDist <= 0) return;

      // Progresso normalizado de 0.0 a 1.0 durante o travamento da seção
      const scrolled = -rect.top;
      let progress = scrolled / scrollDist;
      progress = Math.max(0, Math.min(1, progress));

      // 1. Desenhar a linha SVG proporcionalmente (0 a 100)
      const currentY = (progress * 100).toFixed(2);
      journeyLineFill.setAttribute('y2', currentY);

      // 2. Mover o brilho viajante (spark) na ponta da linha
      if (journeySpark) {
        journeySpark.style.top = `${currentY}%`;
        journeySpark.style.opacity = (progress > 0.02 && progress < 0.98) ? '1' : '0';
      }

      // 3. Card 01: Ativo desde o início
      stepItems[0].classList.add('is-active');
      stepItems[0].classList.remove('is-dimmed');

      // 4. Card 02: Revela quando a linha atinge ~32%
      if (progress >= 0.32) {
        stepItems[1].classList.add('is-active');
        stepItems[1].classList.remove('is-dimmed');
      } else {
        stepItems[1].classList.remove('is-active');
        stepItems[1].classList.add('is-dimmed');
      }

      // 5. Card 03: Revela quando a linha atinge ~68%
      if (progress >= 0.68) {
        stepItems[2].classList.add('is-active');
        stepItems[2].classList.remove('is-dimmed');
      } else {
        stepItems[2].classList.remove('is-active');
        stepItems[2].classList.add('is-dimmed');
      }

      // 6. Banner prático: Ilumina no desfecho da jornada
      if (practicalBanner) {
        if (progress >= 0.85) {
          practicalBanner.classList.add('is-active');
        } else {
          practicalBanner.classList.remove('is-active');
        }
      }
    }

    // Inicialização
    updateSvgPositions();
    updateJourneyProgress();

    // Listener de scroll com requestAnimationFrame para 60/120fps fluido
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateJourneyProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Recalcular no redimensionamento da tela
    window.addEventListener('resize', () => {
      updateSvgPositions();
      updateJourneyProgress();
    });
  }

  // 6. Dobra 6: Shader WebGL Flow Field Fluido com Paleta Terracota & Dourado
  function initDobra6Shader() {
    const canvas = document.getElementById('shaderDobra6');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'low-power' });
    if (!gl) return; // Fallback elegante para o CSS background-color

    const VERT = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1], smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  float a = fbm(p * 2.0 + u_seed) * 6.2831;
  vec2 dir = vec2(cos(a), sin(a));
  float v = fbm(p * 3.0 + dir * (u_intensity * 2.0) + t * 0.12);
  return palette(v);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;

  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));

  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }

  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }

  if (abs(u_contrast - 1.0) > 0.0001) col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001) col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001) col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

    // Paleta adaptada estritamente para a identidade visual Marsala & Terracota Queimado
    const UNIFORMS = {
      colors: [
        [0.23, 0.07, 0.08], // Sombra vinho / Marsala escuro (#3A1314)
        [0.42, 0.16, 0.17], // Marsala Primária (#6B2A2B)
        [0.63, 0.28, 0.24], // Terracota Queimado Destaque (#A0483D)
        [0.73, 0.37, 0.32], // Terracota suave / Coral blush (#BA5F52)
        [0.94, 0.90, 0.87], // Nude / Blush suave (#F0E5DE)
        [0.94, 0.90, 0.87],
        [0.94, 0.90, 0.87],
        [0.94, 0.90, 0.87],
      ],
      colorCount: 5,
      scale: 1.350,
      intensity: 0.350,
      paramA: 0.570,
      warp: 0.220,
      detail: 2.000,
      contrast: 1.150,
      brightness: 0.020,
      saturation: 1.350,
      hue: 0.0,
      vignette: 0.380,
      blur: 0.0048,
      grain: 0.020,
      seed: 8379.0,
      rotate: 5.0091,
      offsetX: -0.020,
      offsetY: 0.150,
      drift: 0.050,
      cursorEnabled: true,
      cursorEffect: 4.0,
      cursorStrength: 0.600,
      cursorRadius: 0.650,
      oklab: 0.0,
      timeScale: -1.000,
    };

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram();
    const vertexShader = compile(gl.VERTEX_SHADER, VERT);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uni = {
      colors: gl.getUniformLocation(program, "u_colors"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
      space: gl.getUniformLocation(program, "u_space"),
      cursor: gl.getUniformLocation(program, "u_cursor"),
    };

    gl.uniform3fv(uni.colors, new Float32Array(UNIFORMS.colors.flat()));
    gl.uniform4f(uni.shape, UNIFORMS.scale, UNIFORMS.intensity, UNIFORMS.paramA, UNIFORMS.warp);
    gl.uniform4f(uni.surface, UNIFORMS.detail, UNIFORMS.contrast, UNIFORMS.brightness, UNIFORMS.saturation);
    gl.uniform4f(uni.finish, UNIFORMS.hue, UNIFORMS.vignette, UNIFORMS.blur, UNIFORMS.grain);
    gl.uniform4f(uni.transform, UNIFORMS.seed, UNIFORMS.rotate, UNIFORMS.drift, UNIFORMS.oklab);
    gl.uniform4f(uni.cursor, 0, UNIFORMS.cursorEffect, UNIFORMS.cursorStrength, UNIFORMS.cursorRadius);

    let targetX = 0, targetY = 0, targetPresence = 0;
    let mouseX = 0, mouseY = 0, cursorPresence = 0;
    let pointerKnown = false, pointerClientX = 0, pointerClientY = 0;
    let bounds = canvas.getBoundingClientRect();
    let raf = 0, lastNow = null;
    let visible = document.visibilityState === "visible";
    let inView = false;
    const start = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rawWidth = Math.max(1, Math.round(bounds.width * dpr));
      const rawHeight = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== rawWidth || canvas.height !== rawHeight) {
        canvas.width = rawWidth;
        canvas.height = rawHeight;
        gl.viewport(0, 0, rawWidth, rawHeight);
      }
    };

    function requestRender() {
      if (visible && inView && raf === 0) {
        raf = requestAnimationFrame(render);
      }
    }

    const updatePointerTarget = () => {
      if (!pointerKnown || bounds.width === 0 || bounds.height === 0) return;
      const inside =
        pointerClientX >= bounds.left &&
        pointerClientX <= bounds.right &&
        pointerClientY >= bounds.top &&
        pointerClientY <= bounds.bottom;
      if (!inside) {
        targetPresence = 0;
        requestRender();
        return;
      }
      targetX = ((pointerClientX - bounds.left) / bounds.width) * 2 - 1;
      targetY = -(((pointerClientY - bounds.top) / bounds.height) * 2 - 1);
      targetPresence = 1;
      requestRender();
    };

    window.addEventListener("pointermove", (e) => {
      pointerKnown = true;
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
      bounds = canvas.getBoundingClientRect();
      updatePointerTarget();
    }, { passive: true });

    const updateLayout = () => {
      bounds = canvas.getBoundingClientRect();
      resizeCanvas();
      updatePointerTarget();
      requestRender();
    };
    window.addEventListener("resize", updateLayout);

    // Observer para rodar o WebGL APENAS quando a Dobra 6 estiver visível na tela
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry ? entry.isIntersecting : false;
      if (inView) {
        bounds = canvas.getBoundingClientRect();
        resizeCanvas();
        requestRender();
      } else if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastNow = null;
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    document.addEventListener("visibilitychange", () => {
      visible = document.visibilityState === "visible";
      if (visible && inView) requestRender();
      else if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastNow = null;
      }
    });

    function render(now) {
      raf = 0;
      if (!visible || !inView) return;
      const dt = lastNow === null ? 0 : Math.min((now - lastNow) / 1000, 0.1);
      lastNow = now;
      const follow = 1 - Math.exp(-12 * dt);
      mouseX += (targetX - mouseX) * follow;
      mouseY += (targetY - mouseY) * follow;
      cursorPresence += (targetPresence - cursorPresence) * follow;

      gl.uniform4f(uni.scene, canvas.width, canvas.height, ((now - start) / 1000) * UNIFORMS.timeScale, UNIFORMS.colorCount);
      gl.uniform4f(uni.space, UNIFORMS.offsetX, UNIFORMS.offsetY, mouseX, mouseY);
      gl.uniform4f(uni.cursor, cursorPresence, UNIFORMS.cursorEffect, UNIFORMS.cursorStrength, UNIFORMS.cursorRadius);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      requestRender();
    }
  }

  initDobra6Shader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIsaApp);
} else {
  initIsaApp();
}
