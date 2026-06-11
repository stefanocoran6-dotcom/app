import React, { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import { Star, Lock, Check, X, Home, BookOpen, User, MessageSquare, Send, Brain, Play, ChevronRight, ChevronLeft, Calculator, Clock, Flame, Target, Zap, Mail, Eye, EyeOff, LogOut, AlertCircle, Sun, Moon, TrendingUp, Award, Trophy, BarChart3, GraduationCap, Sparkles, Layers, RotateCcw, ChevronDown } from 'lucide-react';

// ========== CFA CURRICULUM DATABASE ==========
const CFA_CURRICULUM = {
  equity: {
    id: 'equity',
    name: 'Equity Investments',
    icon: '📈',
    weight: '11-14%',
    color: 'from-blue-500 to-indigo-600',
    totalModules: 8,
    modules: [{
      id: 'equity-lm1',
      number: 1,
      title: 'Market Organization and Structure',
      estimatedTime: '4-6 hours',
      totalLOS: 12,
      los: [{
        id: 'a',
        code: 'LOS 36a',
        title: 'Explain the main functions of the financial system',
        commandWord: 'Explain',
        importance: 'HIGH',
        content: {
          introduction: 'The financial system performs six main functions that enable individuals, companies, and governments to achieve their financial objectives.',
          sections: [{
            title: '1. SAVING',
            icon: '💰',
            content: 'Individuals and companies set aside money in the present to have more in the future.\n\n• Individuals save during working years to finance retirement\n• Companies save to repay suppliers, purchase equipment, or make acquisitions\n• Investors who accept more risk expect higher returns'
          }, {
            title: '2. BORROWING',
            icon: '🏦',
            content: 'Receiving money in the present that will be repaid in the future.\n\nSECURED LOANS:\n• Lender can sell collateral if borrower defaults\n• Examples: mortgages, auto loans\n• Lower interest rates\n\nUNSECURED LOANS:\n• No collateral\n• Examples: credit cards, student loans\n• Higher interest rates'
          }, {
            title: '3. RAISING EQUITY CAPITAL',
            icon: '📊',
            content: 'Companies raise equity capital by selling ownership shares.\n\n• Investment banks assist in issuing shares\n• Unlike debt, equity does not promise fixed payments\n• Investors expect dividends and capital gains'
          }, {
            title: '4. MANAGING RISKS',
            icon: '🛡️',
            content: 'Using financial instruments to offset adverse price movements.\n\nINSTRUMENTS:\n• Forward contracts\n• Futures contracts\n• Options contracts\n• Insurance contracts\n\nEXAMPLE: Airline buys fuel forward to hedge price risk'
          }, {
            title: '5. EXCHANGING ASSETS',
            icon: '🔄',
            content: 'Exchanging currencies, commodities for immediate delivery.\n\n• Spot market = immediate settlement\n• Spot price = current market price\n• Settlement typically T+2'
          }, {
            title: '6. INFORMATION-MOTIVATED TRADING',
            icon: '🧠',
            content: 'Trading based on informational advantage.\n\n• Traders expect EXCESS returns\n• Identify undervalued/overvalued securities\n• Active managers seek to beat benchmarks'
          }]
        },
        keyPoints: ['Financial system has 6 main functions', 'Saving = setting aside for future', 'Secured vs unsecured borrowing', 'Equity = selling ownership', 'Risk management via derivatives', 'Info trading = EXCESS returns'],
        examTips: ['🎯 Identify which function given a scenario', '⚠️ Secured vs unsecured key difference', '💡 Info traders seek EXCESS returns']
      }, {
        id: 'b',
        code: 'LOS 36b',
        title: 'Describe classifications of assets and markets',
        commandWord: 'Describe',
        importance: 'HIGH',
        content: {
          introduction: 'Financial assets and markets are classified into several categories.',
          sections: [{
            title: 'ASSET TYPES',
            icon: '📦',
            content: 'SECURITIES: Debt & Equity\nCURRENCIES: Forex market\nCONTRACTS: Derivatives\nCOMMODITIES: Metals, energy\nREAL ASSETS: Real estate'
          }, {
            title: 'PRIMARY vs SECONDARY',
            icon: '🏛️',
            content: 'PRIMARY MARKET:\n• NEW securities issued\n• Funds go to ISSUER\n• Examples: IPO\n\nSECONDARY MARKET:\n• EXISTING securities traded\n• Funds between INVESTORS\n• Examples: NYSE, NASDAQ'
          }, {
            title: 'MONEY vs CAPITAL',
            icon: '⏱️',
            content: 'MONEY MARKETS:\n• Maturity ≤ 1 year\n• T-bills, commercial paper\n\nCAPITAL MARKETS:\n• Maturity > 1 year\n• Bonds, stocks'
          }, {
            title: 'TRADITIONAL vs ALTERNATIVE',
            icon: '🔮',
            content: 'TRADITIONAL:\n• Public debt & equity\n• High liquidity\n\nALTERNATIVE:\n• PE, hedge funds, RE\n• Less liquid, higher returns'
          }]
        },
        keyPoints: ['5 asset types', 'PRIMARY = issuer receives', 'SECONDARY = investors trade', 'Money ≤ 1yr, Capital > 1yr'],
        examTips: ['🎯 Primary vs Secondary is KEY', '💡 IPO = primary, NYSE = secondary']
      }, {
        id: 'f',
        code: 'LOS 36f',
        title: 'Calculate leverage ratio, margin return, and margin call price',
        commandWord: 'Calculate',
        importance: 'VERY HIGH',
        content: {
          introduction: 'Margin transactions amplify returns using borrowed money. CALCULATION LOS!',
          sections: [{
            title: 'CONCEPTS',
            icon: '📚',
            content: 'MARGIN = buying with borrowed money\nINITIAL MARGIN = % investor puts up\nMAINTENANCE MARGIN = minimum equity (25%)\nMARGIN CALL = broker demands more funds'
          }, {
            title: 'LEVERAGE RATIO',
            icon: '⚖️',
            content: 'LEVERAGE = Total Value / Equity\n\nMAX LEVERAGE = 1 / Initial Margin\n\nExample: 40% margin = 2.5x leverage'
          }, {
            title: 'MARGIN CALL PRICE',
            icon: '🚨',
            content: 'MARGIN CALL PRICE = Debt / (1 - Maint. Margin)\n\nExample:\n• Buy at $30, Leverage 2x\n• Equity = $15, Debt = $15\n• Maint. margin = 25%\n\nCall Price = $15 / 0.75 = $20\n\nIf price hits $20 → MARGIN CALL!'
          }, {
            title: 'LEVERAGE EFFECT',
            icon: '⚡',
            content: 'Leverage AMPLIFIES both ways!\n\n2x leverage:\n• +10% price → +20% return ✅\n• -10% price → -20% return ❌\n\n⚠️ DOUBLE-EDGED SWORD'
          }]
        },
        keyPoints: ['Leverage = Value / Equity', 'Max Leverage = 1 / Initial Margin', 'Call Price = Debt / (1 - Maint%)', 'Leverage amplifies BOTH ways'],
        examTips: ['⚠️ MARGIN CALL FORMULA - MEMORIZE!', '📝 Practice calculations!']
      }]
    }]
  }
};

// ========== THEME SYSTEM ==========
const ThemeContext = /*#__PURE__*/createContext();
const themes = {
  dark: {
    name: 'dark',
    bg: 'bg-slate-900',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
    card: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    text: 'text-white',
    textMuted: 'text-slate-400',
    textSecondary: 'text-slate-300',
    input: 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500',
    nav: 'bg-slate-900 border-slate-800',
    accent: 'amber'
  },
  light: {
    name: 'light',
    bg: 'bg-slate-50',
    bgGradient: 'from-slate-100 via-white to-slate-100',
    card: 'bg-white',
    cardBorder: 'border-slate-200',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    textSecondary: 'text-slate-600',
    input: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
    nav: 'bg-white border-slate-200',
    accent: 'amber'
  }
};

// ========== PROFESSIONAL SVG ICONS ==========

// Bull Mascot - Professional stylized bull head
// ========== BULL MASCOT v4 — anatomia ricca + 7 mood + vestiti + animazioni complesse ==========
// Struttura: macchia sull'occhio, chiazze sul corpo, zoccoli bipartiti, ciuffo petto, anelli sulle corna, coda animata
// Mood: neutral · happy · thinking (occhiali+matita) · celebrating (cappellino) · sad · correct (medaglia+wink+salto) · wrong (testa che fa no+sudore+grattata)
const BullMascot = ({
  size = 80,
  mood = 'neutral',
  className = ''
}) => {
  const lookUp = mood === 'thinking';
  const pupX = lookUp ? 2.5 : 0;
  const pupY = lookUp ? -3 : 0;
  const openEyes = !['happy', 'celebrating', 'correct', 'wrong'].includes(mood);
  const earL = mood === 'wrong' ? -62 : -32;
  const earR = mood === 'wrong' ? 62 : 32;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 104",
    width: size,
    height: size * 1.04,
    className: className
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "bmHead3d",
    cx: "38%",
    cy: "28%",
    r: "78%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fde68a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "38%",
    stopColor: "#fbbf24"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "72%",
    stopColor: "#f59e0b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#c2410c"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "bmBody3d",
    cx: "40%",
    cy: "25%",
    r: "80%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fcd34d"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "60%",
    stopColor: "#f59e0b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#b45309"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "bmMuzzle3d",
    cx: "42%",
    cy: "28%",
    r: "80%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fef3c7"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: "#fde68a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#f59e0b"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "bmHorn3d",
    x1: "0%",
    y1: "100%",
    x2: "30%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#eab308"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "45%",
    stopColor: "#fcd34d"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#fefce8"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "bmPupil",
    cx: "38%",
    cy: "32%",
    r: "80%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#5b3a1e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#241105"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "bmBelly",
    cx: "45%",
    cy: "30%",
    r: "80%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fef3c7"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#fbbf24"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "bmMedal",
    cx: "38%",
    cy: "32%",
    r: "80%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fef08a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "70%",
    stopColor: "#facc15"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#a16207"
  }))), /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "100",
    rx: "24",
    ry: "3.6",
    fill: "#000",
    opacity: "0.22"
  }, mood === 'correct' ? /*#__PURE__*/React.createElement("animate", {
    attributeName: "rx",
    values: "24;20;24",
    dur: "0.62s",
    repeatCount: "indefinite"
  }) : /*#__PURE__*/React.createElement("animate", {
    attributeName: "rx",
    values: "24;25.5;24",
    dur: "3.4s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("g", null, mood === 'correct' && /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 0;0 -4;0 0",
    keyTimes: "0;0.4;1",
    dur: "0.62s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "6 68 82;-8 68 82;6 68 82",
    dur: mood === 'correct' ? '0.7s' : '1.9s',
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M68,82 Q80,84 79,93",
    stroke: "#c2620a",
    strokeWidth: "3.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M77.5,91 Q82,92 80,97 Q77,96 77.5,91 Z",
    fill: "#7c3b0c"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "84",
    rx: "19",
    ry: "13.5",
    fill: "url(#bmBody3d)"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "ry",
    values: "13.5;14.3;13.5",
    dur: "3.4s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "cy",
    values: "84;83.4;84",
    dur: "3.4s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("ellipse", {
    cx: "35",
    cy: "80",
    rx: "4.5",
    ry: "3.2",
    fill: "#c2620a",
    opacity: "0.55",
    transform: "rotate(-18 35 80)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "64",
    cy: "88",
    rx: "3.6",
    ry: "2.6",
    fill: "#c2620a",
    opacity: "0.5",
    transform: "rotate(14 64 88)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "87",
    rx: "11.5",
    ry: "8",
    fill: "url(#bmBelly)"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "ry",
    values: "8;8.6;8",
    dur: "3.4s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M44,79.5 L46.5,82.5 L50,79.5 L53.5,82.5 L56,79.5",
    stroke: "#fde68a",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33,76 Q50,83 67,76 Q50,72 33,76 Z",
    fill: "#7c2d12",
    opacity: "0.25"
  })), /*#__PURE__*/React.createElement("ellipse", {
    cx: "42",
    cy: "96",
    rx: "5.5",
    ry: "3.8",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "58",
    cy: "96",
    rx: "5.5",
    ry: "3.8",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "41",
    cy: "94.8",
    rx: "4",
    ry: "2.2",
    fill: "#a85e16"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "57",
    cy: "94.8",
    rx: "4",
    ry: "2.2",
    fill: "#a85e16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M42,93.5 L42,98.5",
    stroke: "#6b3a0c",
    strokeWidth: "1.2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58,93.5 L58,98.5",
    stroke: "#6b3a0c",
    strokeWidth: "1.2",
    strokeLinecap: "round"
  }), mood === 'celebrating' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "-10 34 80;12 34 80;-10 34 80",
    dur: "0.65s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M34,80 Q24,72 21,62",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20.5",
    cy: "60.5",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.5,60.5 L22.5,60.5",
    stroke: "#6b3a0c",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "10 66 80;-12 66 80;10 66 80",
    dur: "0.65s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66,80 Q76,72 79,62",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "79.5",
    cy: "60.5",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M77.5,60.5 L81.5,60.5",
    stroke: "#6b3a0c",
    strokeWidth: "1"
  }))) : mood === 'correct' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M34,81 Q27,84 25,89",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "25",
    cy: "90",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "0 66 80;-16 66 80;0 66 80",
    dur: "0.62s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66,80 Q76,70 77,60",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "77.5",
    cy: "58.5",
    r: "4.6",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M75.3,58.5 L79.7,58.5",
    stroke: "#6b3a0c",
    strokeWidth: "1"
  }))) : mood === 'wrong' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M34,82 Q28,86 26,91",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "26",
    cy: "92",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 0;0 -2.5;0 0",
    dur: "0.5s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66,80 Q78,66 72,52",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "71.5",
    cy: "50.5",
    r: "4",
    fill: "#8a4a10"
  }))) : mood === 'thinking' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M34,82 Q28,86 26,91",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "26",
    cy: "92",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "0 66 82;-4 66 82;0 66 82",
    dur: "2.2s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66,82 Q70,74 62,68",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "61",
    cy: "67.5",
    r: "4",
    fill: "#8a4a10"
  }))) : mood === 'sad' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M34,82 Q30,88 30,93",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66,82 Q70,88 70,93",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "30",
    cy: "93.5",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "93.5",
    r: "4",
    fill: "#8a4a10"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M34,81 Q27,84 25,89",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66,81 Q73,84 75,89",
    stroke: "#e8890c",
    strokeWidth: "6.5",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "25",
    cy: "90",
    r: "4",
    fill: "#8a4a10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "75",
    cy: "90",
    r: "4",
    fill: "#8a4a10"
  })), mood === 'correct' && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "-3 50 72;3 50 72;-3 50 72",
    dur: "0.62s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M43,71 L50,80 L57,71",
    stroke: "#dc2626",
    strokeWidth: "3.2",
    fill: "none",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "82",
    r: "5.2",
    fill: "url(#bmMedal)",
    stroke: "#a16207",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M50,79.2 l0.9,1.8 2,.3 -1.45,1.4 .35,2 -1.8,-1 -1.8,1 .35,-2 -1.45,-1.4 2,-.3 Z",
    fill: "#a16207"
  })), /*#__PURE__*/React.createElement("g", null, mood === 'wrong' ? /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "0 50 45;-6 50 45;6 50 45;-4 50 45;4 50 45;0 50 45;0 50 45",
    keyTimes: "0;0.08;0.2;0.32;0.44;0.55;1",
    dur: "1.8s",
    repeatCount: "indefinite"
  }) : mood === 'happy' || mood === 'celebrating' || mood === 'correct' ? /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "-2.5 50 45;2.5 50 45;-2.5 50 45",
    dur: "1.6s",
    repeatCount: "indefinite"
  }) : /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 0;0 1.5;0 0",
    dur: "3.4s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21,32 Q8,24 9,11 Q12,9 17,12 Q26,18 29,28 Z",
    fill: "url(#bmHorn3d)",
    stroke: "#b8932e",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M79,32 Q92,24 91,11 Q88,9 83,12 Q74,18 71,28 Z",
    fill: "url(#bmHorn3d)",
    stroke: "#b8932e",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22,29 Q26,26 28,24",
    stroke: "#b8932e",
    strokeWidth: "1.3",
    fill: "none",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18,23 Q22,20 24,18",
    stroke: "#b8932e",
    strokeWidth: "1.1",
    fill: "none",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M78,29 Q74,26 72,24",
    stroke: "#b8932e",
    strokeWidth: "1.3",
    fill: "none",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M82,23 Q78,20 76,18",
    stroke: "#b8932e",
    strokeWidth: "1.1",
    fill: "none",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12,26 Q10,19 11,13",
    stroke: "#fffbeb",
    strokeWidth: "1.6",
    fill: "none",
    strokeLinecap: "round",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "17",
    cy: "40",
    rx: "9.5",
    ry: "6.5",
    fill: "#d96708",
    transform: `rotate(${earL} 17 40)`
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "18.5",
    cy: "40.5",
    rx: "6",
    ry: "3.6",
    fill: "#fdba74",
    transform: `rotate(${earL} 18.5 40.5)`
  })), /*#__PURE__*/React.createElement("g", null, mood !== 'wrong' && /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: "0 80 36;0 80 36;-14 80 36;10 80 36;0 80 36;0 80 36",
    keyTimes: "0;0.82;0.87;0.91;0.95;1",
    dur: "5.5s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "83",
    cy: "40",
    rx: "9.5",
    ry: "6.5",
    fill: "#d96708",
    transform: `rotate(${earR} 83 40)`
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "81.5",
    cy: "40.5",
    rx: "6",
    ry: "3.6",
    fill: "#fdba74",
    transform: `rotate(${earR} 81.5 40.5)`
  })), /*#__PURE__*/React.createElement("path", {
    d: "M50,11 C71,11 83,25 83,42 C83,60 70,70 50,70 C30,70 17,60 17,42 C17,25 29,11 50,11 Z",
    fill: "url(#bmHead3d)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "64.5",
    cy: "36",
    rx: "12",
    ry: "13",
    fill: "#d97706",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26,20 Q36,12 48,12",
    stroke: "#fef3c7",
    strokeWidth: "2.4",
    fill: "none",
    strokeLinecap: "round",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24,58 Q38,69 50,69.5 Q35,71 25,62 Z",
    fill: "#7c2d12",
    opacity: "0.22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M76,58 Q62,69 50,69.5 Q65,71 75,62 Z",
    fill: "#7c2d12",
    opacity: "0.16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40,12 Q43,5 48,10 Q50,3 54,9 Q58,4 60,12 Q55,15 50,14 Q45,15 40,12 Z",
    fill: "#c2620a"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M42,11.5 Q45,7 48,10.5",
    stroke: "#e8890c",
    strokeWidth: "1.6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M51,10 Q53,6.5 55.5,9.5",
    stroke: "#e8890c",
    strokeWidth: "1.3",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "50",
    cy: "57",
    rx: "19.5",
    ry: "13",
    fill: "url(#bmMuzzle3d)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33,61 Q50,71.5 67,61 Q50,67 33,61 Z",
    fill: "#b45309",
    opacity: "0.2"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "43",
    cy: "56",
    rx: "3.4",
    ry: "4.2",
    fill: "#7c3b0c"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "57",
    cy: "56",
    rx: "3.4",
    ry: "4.2",
    fill: "#7c3b0c"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "42.2",
    cy: "54.6",
    rx: "1.2",
    ry: "1.6",
    fill: "#b06a36"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "56.2",
    cy: "54.6",
    rx: "1.2",
    ry: "1.6",
    fill: "#b06a36"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M45.5,64 A4.5,4.5 0 0 0 54.5,64",
    stroke: "#ca8a04",
    strokeWidth: "3",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46.5,65.5 A3.6,3.6 0 0 0 51,67.5",
    stroke: "#fef08a",
    strokeWidth: "1.2",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "45.5",
    cy: "64",
    r: "1.3",
    fill: "#facc15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "54.5",
    cy: "64",
    r: "1.3",
    fill: "#facc15"
  }), mood === 'celebrating' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M42,65.5 Q50,75 58,65.5 Q50,69.5 42,65.5 Z",
    fill: "#5c1f0a"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46,69.5 Q50,72.5 54,69.5 Q50,74 46,69.5 Z",
    fill: "#fb7185"
  })), mood === 'correct' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M41,64.5 Q50,73.5 59,64.5 Q50,68.5 41,64.5 Z",
    fill: "#5c1f0a"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M45,64.9 L55,64.9 L54,67 L46,67 Z",
    fill: "#fff"
  })), mood === 'wrong' && /*#__PURE__*/React.createElement("path", {
    d: "M43,67 Q46,65 49,67 Q52,69 55,67",
    stroke: "#7c3b0c",
    strokeWidth: "2.3",
    fill: "none",
    strokeLinecap: "round"
  }), mood === 'happy' && /*#__PURE__*/React.createElement("path", {
    d: "M42,64.5 Q50,71 58,64.5",
    stroke: "#7c3b0c",
    strokeWidth: "2.4",
    fill: "none",
    strokeLinecap: "round"
  }), mood === 'neutral' && /*#__PURE__*/React.createElement("path", {
    d: "M44,65.5 Q50,69 56,65.5",
    stroke: "#7c3b0c",
    strokeWidth: "2.2",
    fill: "none",
    strokeLinecap: "round"
  }), mood === 'thinking' && /*#__PURE__*/React.createElement("path", {
    d: "M45,66.5 Q49,65 53,67.5",
    stroke: "#7c3b0c",
    strokeWidth: "2.2",
    fill: "none",
    strokeLinecap: "round"
  }), mood === 'sad' && /*#__PURE__*/React.createElement("path", {
    d: "M43,68 Q50,62.5 57,68",
    stroke: "#7c3b0c",
    strokeWidth: "2.4",
    fill: "none",
    strokeLinecap: "round"
  }), (mood === 'happy' || mood === 'celebrating') && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M28,38 Q35,29 42,38",
    stroke: "#2a160a",
    strokeWidth: "3.6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58,38 Q65,29 72,38",
    stroke: "#2a160a",
    strokeWidth: "3.6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "30",
    cy: "47",
    rx: "5",
    ry: "3",
    fill: "#fb923c",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "70",
    cy: "47",
    rx: "5",
    ry: "3",
    fill: "#fb923c",
    opacity: "0.6"
  })), mood === 'correct' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "35.5",
    cy: "37.5",
    rx: "10",
    ry: "11.6",
    fill: "#c2620a",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "35.5",
    cy: "37",
    rx: "9.2",
    ry: "10.8",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "35.5",
    cy: "38",
    r: "5.8",
    fill: "url(#bmPupil)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "37.7",
    cy: "35.4",
    r: "2.3",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "33.5",
    cy: "40.4",
    r: "1.1",
    fill: "#ffffff",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58,38 Q65,30 72,38",
    stroke: "#2a160a",
    strokeWidth: "3.6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "70",
    cy: "46.5",
    rx: "5",
    ry: "3",
    fill: "#fb923c",
    opacity: "0.6"
  })), mood === 'wrong' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M29,33.5 L41,38 L29,42.5",
    stroke: "#2a160a",
    strokeWidth: "3.2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M71,33.5 L59,38 L71,42.5",
    stroke: "#2a160a",
    strokeWidth: "3.2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), openEyes && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "35.5",
    cy: "37.5",
    rx: "10",
    ry: "11.6",
    fill: "#c2620a",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "64.5",
    cy: "37.5",
    rx: "10",
    ry: "11.6",
    fill: "#c2620a",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "35.5",
    cy: "37",
    rx: "9.2",
    ry: "10.8",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "64.5",
    cy: "37",
    rx: "9.2",
    ry: "10.8",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26.3,33 A9.2,10.8 0 0 1 44.7,33 A9.2,7 0 0 0 26.3,33 Z",
    fill: "#d4c19a",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55.3,33 A9.2,10.8 0 0 1 73.7,33 A9.2,7 0 0 0 55.3,33 Z",
    fill: "#d4c19a",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 35.5 + pupX,
    cy: 38 + pupY,
    r: "5.6",
    fill: "url(#bmPupil)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 64.5 + pupX,
    cy: 38 + pupY,
    r: "5.6",
    fill: "url(#bmPupil)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 37.6 + pupX,
    cy: 35.6 + pupY,
    r: "2.1",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 66.6 + pupX,
    cy: 35.6 + pupY,
    r: "2.1",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 33.6 + pupX,
    cy: 40.2 + pupY,
    r: "1",
    fill: "#ffffff",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 62.6 + pupX,
    cy: 40.2 + pupY,
    r: "1",
    fill: "#ffffff",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: 35.5 + pupX,
    cy: 42 + pupY,
    rx: "3.4",
    ry: "1.2",
    fill: "#8b5a2b",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: 64.5 + pupX,
    cy: 42 + pupY,
    rx: "3.4",
    ry: "1.2",
    fill: "#8b5a2b",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "35.5",
    cy: "30",
    rx: "9.4",
    ry: "0",
    fill: "url(#bmHead3d)"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "ry",
    values: "0;0;11;0;0",
    keyTimes: "0;0.9;0.94;0.98;1",
    dur: "4.6s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "cy",
    values: "30;30;37;30;30",
    keyTimes: "0;0.9;0.94;0.98;1",
    dur: "4.6s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("ellipse", {
    cx: "64.5",
    cy: "30",
    rx: "9.4",
    ry: "0",
    fill: "url(#bmHead3d)"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "ry",
    values: "0;0;11;0;0",
    keyTimes: "0;0.9;0.94;0.98;1",
    dur: "4.6s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "cy",
    values: "30;30;37;30;30",
    keyTimes: "0;0.9;0.94;0.98;1",
    dur: "4.6s",
    repeatCount: "indefinite"
  }))), mood === 'sad' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M26.3,26 L44.7,26 L44.7,31 Q35.5,33 26.3,31 Z",
    fill: "url(#bmHead3d)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55.3,26 L73.7,26 L73.7,31 Q64.5,33 55.3,31 Z",
    fill: "url(#bmHead3d)"
  }))), mood === 'thinking' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "35.5",
    cy: "37.5",
    r: "11",
    fill: "none",
    stroke: "#3b2313",
    strokeWidth: "2.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64.5",
    cy: "37.5",
    r: "11",
    fill: "none",
    stroke: "#3b2313",
    strokeWidth: "2.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46.5,37 Q50,34.5 53.5,37",
    stroke: "#3b2313",
    strokeWidth: "2.2",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24.5,36 L18,33",
    stroke: "#3b2313",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M75.5,36 L82,33",
    stroke: "#3b2313",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "rotate(-24 22 28)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "25.5",
    width: "15",
    height: "4.2",
    rx: "1",
    fill: "#fbbf24",
    stroke: "#b45309",
    strokeWidth: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M29,25.5 L33,27.6 L29,29.7 Z",
    fill: "#fde68a",
    stroke: "#b45309",
    strokeWidth: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M31.7,26.9 L33,27.6 L31.7,28.3 Z",
    fill: "#3b2313"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "25.5",
    width: "2.6",
    height: "4.2",
    rx: "1",
    fill: "#fb7185"
  }))), mood === 'neutral' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M28,24.5 Q35,21.5 42,24.5",
    stroke: "#8a4a10",
    strokeWidth: "2.6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58,24.5 Q65,21.5 72,24.5",
    stroke: "#8a4a10",
    strokeWidth: "2.6",
    fill: "none",
    strokeLinecap: "round"
  })), mood === 'correct' && /*#__PURE__*/React.createElement("path", {
    d: "M28,24 Q35,20.5 42,23.5",
    stroke: "#8a4a10",
    strokeWidth: "2.6",
    fill: "none",
    strokeLinecap: "round"
  }), mood === 'wrong' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M28,27 Q35,29.5 41,31",
    stroke: "#8a4a10",
    strokeWidth: "2.8",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M59,31 Q65,29.5 72,27",
    stroke: "#8a4a10",
    strokeWidth: "2.8",
    fill: "none",
    strokeLinecap: "round"
  })), mood === 'thinking' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M28,22 Q35,17.5 42,21",
    stroke: "#8a4a10",
    strokeWidth: "2.8",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58,25 Q65,23.5 72,25.5",
    stroke: "#8a4a10",
    strokeWidth: "2.8",
    fill: "none",
    strokeLinecap: "round"
  })), mood === 'sad' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M29,26.5 Q35.5,25.5 42,22.5",
    stroke: "#8a4a10",
    strokeWidth: "2.6",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58,22.5 Q64.5,25.5 71,26.5",
    stroke: "#8a4a10",
    strokeWidth: "2.6",
    fill: "none",
    strokeLinecap: "round"
  })), mood === 'celebrating' && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M44,11 L50,1 L56,11 Z",
    fill: "#7c4dd6",
    transform: "rotate(8 50 6)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44,11 L50,1 L50.5,11 Z",
    fill: "#9d75e8",
    transform: "rotate(8 50 6)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50.5",
    cy: "1.5",
    r: "2.2",
    fill: "#facc15",
    transform: "rotate(8 50 6)"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "r",
    values: "2.2;2.7;2.2",
    dur: "0.65s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M44.5,10.5 L55.5,10.5",
    stroke: "#facc15",
    strokeWidth: "1.5",
    transform: "rotate(8 50 6)"
  })), mood === 'wrong' && /*#__PURE__*/React.createElement("path", {
    d: "M77,24 q-2.8,4.8 0,7 q2.8,-2.2 0,-7 Z",
    fill: "#7dd3fc"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0;1;1;0",
    keyTimes: "0;0.15;0.75;1",
    dur: "1.8s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 0;0 9",
    dur: "1.8s",
    repeatCount: "indefinite"
  })), mood === 'sad' && /*#__PURE__*/React.createElement("path", {
    d: "M28,46 q-2.6,4.5 0,6.5 q2.6,-2 0,-6.5 Z",
    fill: "#7dd3fc"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0;1;1;0",
    keyTimes: "0;0.2;0.8;1",
    dur: "2.4s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 0;0 7",
    dur: "2.4s",
    repeatCount: "indefinite"
  })))), mood === 'correct' && /*#__PURE__*/React.createElement(React.Fragment, null, [[14, 30, 0], [86, 26, 0.2], [10, 58, 0.45], [90, 56, 0.32]].map(([x, y, d], i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("path", {
    d: `M${x - 3},${y} l2.2,2.4 l4,-5`,
    stroke: "#34d399",
    strokeWidth: "2.6",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0;1;0",
    keyTimes: "0;0.3;1",
    dur: "1.25s",
    begin: `${d}s`,
    repeatCount: "indefinite"
  })))), /*#__PURE__*/React.createElement("path", {
    d: "M50,2 l1.3,2.6 2.8,.4 -2,1.95 .47,2.8 -2.57,-1.35 -2.57,1.35 .47,-2.8 -2,-1.95 2.8,-.4 Z",
    fill: "#facc15"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.3;1;0.3",
    dur: "0.62s",
    repeatCount: "indefinite"
  }))), mood === 'wrong' && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("text", {
    x: "87",
    y: "16",
    fontSize: "13",
    fontWeight: "bold",
    fill: "#fb923c",
    fontFamily: "sans-serif"
  }, "?", /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0;1;1;0",
    keyTimes: "0;0.2;0.8;1",
    dur: "1.8s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 2;0 -3;0 2",
    dur: "1.8s",
    repeatCount: "indefinite"
  })), mood === 'celebrating' && /*#__PURE__*/React.createElement(React.Fragment, null, [[12, '#34d399', 0], [88, '#60a5fa', 0.4], [22, '#fb7185', 0.9], [78, '#facc15', 0.2], [50, '#7c4dd6', 0.6]].map(([x, c, d], i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x,
    cy: "6",
    r: "2",
    fill: c
  }, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    type: "translate",
    values: "0 -6;0 86",
    dur: "1.7s",
    begin: `${d}s`,
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0;1;1;0",
    keyTimes: "0;0.1;0.75;1",
    dur: "1.7s",
    begin: `${d}s`,
    repeatCount: "indefinite"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M10,56 l1.4,2.8 3,.4 -2.2,2.1 .5,3 -2.7,-1.5 -2.7,1.5 .5,-3 -2.2,-2.1 3,-.4 Z",
    fill: "#facc15"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.2;1;0.2",
    dur: "1.1s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M86,58 l1.2,2.4 2.6,.35 -1.9,1.8 .45,2.6 -2.35,-1.3 -2.35,1.3 .45,-2.6 -1.9,-1.8 2.6,-.35 Z",
    fill: "#34d399"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "1;0.2;1",
    dur: "1.3s",
    repeatCount: "indefinite"
  }))), mood === 'thinking' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "18",
    r: "2",
    fill: "#cbd5e1"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.25;1;0.25",
    dur: "1.8s",
    begin: "0s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "86",
    cy: "11",
    r: "3",
    fill: "#cbd5e1"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.25;1;0.25",
    dur: "1.8s",
    begin: "0.45s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "93",
    cy: "4",
    r: "3.8",
    fill: "#cbd5e1"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.25;1;0.25",
    dur: "1.8s",
    begin: "0.9s",
    repeatCount: "indefinite"
  }))));
};

// Level Icons - Professional rank badges
const RookieIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "rookieGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#94a3b8"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#64748b"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#rookieGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M50,25 L55,40 L70,40 L58,50 L63,65 L50,55 L37,65 L42,50 L30,40 L45,40 Z",
  fill: "white",
  opacity: "0.9"
}));
const TraderIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "traderGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#3b82f6"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#1d4ed8"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#traderGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,65 L40,45 L55,55 L75,30",
  stroke: "white",
  strokeWidth: "4",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M65,30 L75,30 L75,40",
  stroke: "white",
  strokeWidth: "4",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const WolfIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "wolfGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#8b5cf6"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#6d28d9"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#wolfGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,45 L35,20 L45,40 Z",
  fill: "white"
}), /*#__PURE__*/React.createElement("path", {
  d: "M75,45 L65,20 L55,40 Z",
  fill: "white"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "50",
  cy: "55",
  rx: "20",
  ry: "18",
  fill: "white"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "40",
  cy: "50",
  r: "4",
  fill: "#6d28d9"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "60",
  cy: "50",
  r: "4",
  fill: "#6d28d9"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "50",
  cy: "62",
  rx: "6",
  ry: "4",
  fill: "#4c1d95"
}));
const BullIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "bullIconGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#fbbf24"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#ea580c"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#bullIconGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M20,40 Q10,20 20,25 Q25,30 30,40",
  fill: "white"
}), /*#__PURE__*/React.createElement("path", {
  d: "M80,40 Q90,20 80,25 Q75,30 70,40",
  fill: "white"
}), /*#__PURE__*/React.createElement("ellipse", {
  cx: "50",
  cy: "55",
  rx: "22",
  ry: "18",
  fill: "white"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "40",
  cy: "50",
  r: "4",
  fill: "#ea580c"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "60",
  cy: "50",
  r: "4",
  fill: "#ea580c"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "44",
  cy: "62",
  r: "3",
  fill: "#fbbf24"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "56",
  cy: "62",
  r: "3",
  fill: "#fbbf24"
}));

// Topic Icons - Professional category icons
const BondsIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "bondsGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#06b6d4"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#0891b2"
}))), /*#__PURE__*/React.createElement("rect", {
  x: "15",
  y: "20",
  width: "70",
  height: "60",
  rx: "8",
  fill: "url(#bondsGrad)"
}), /*#__PURE__*/React.createElement("rect", {
  x: "25",
  y: "30",
  width: "50",
  height: "8",
  rx: "2",
  fill: "white",
  opacity: "0.9"
}), /*#__PURE__*/React.createElement("rect", {
  x: "25",
  y: "45",
  width: "35",
  height: "6",
  rx: "2",
  fill: "white",
  opacity: "0.6"
}), /*#__PURE__*/React.createElement("rect", {
  x: "25",
  y: "58",
  width: "25",
  height: "6",
  rx: "2",
  fill: "white",
  opacity: "0.6"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "70",
  cy: "60",
  r: "12",
  fill: "white",
  opacity: "0.9"
}), /*#__PURE__*/React.createElement("text", {
  x: "70",
  y: "65",
  textAnchor: "middle",
  fontSize: "14",
  fill: "#0891b2",
  fontWeight: "bold"
}, "%"));
const EquityIcon = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "equityGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#10b981"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#059669"
}))), /*#__PURE__*/React.createElement("circle", {
  cx: "50",
  cy: "50",
  r: "40",
  fill: "url(#equityGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,70 L35,50 L50,60 L65,35 L80,45",
  stroke: "white",
  strokeWidth: "4",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "80",
  cy: "45",
  r: "6",
  fill: "white"
}));

// Flame Icon - Animated
const FlameIconSVG = ({
  size = 24,
  animated = false,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: size,
  height: size,
  className: `${className} ${animated ? 'animate-pulse' : ''}`
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "flameGradient",
  x1: "0%",
  y1: "100%",
  x2: "0%",
  y2: "0%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#ea580c"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "50%",
  stopColor: "#f59e0b"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#fcd34d"
}))), /*#__PURE__*/React.createElement("path", {
  fill: "url(#flameGradient)",
  d: "M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.405-4.83 3.49-6.035-.145 1.035.09 2.09.67 2.965.65.98 1.64 1.67 2.76 1.94-.17-.89-.08-1.82.25-2.65.33-.84.88-1.54 1.58-2.02-.12.66.02 1.35.39 1.92.37.57.95.99 1.62 1.18-.19-.73-.15-1.5.11-2.22.27-.72.74-1.35 1.35-1.78-.08.87.13 1.75.58 2.5.45.74 1.12 1.32 1.9 1.65C19.89 15.08 19 18.91 15 21.5c-.95.58-2.02.96-3.15 1.1-.61.08-1.23.08-1.85.01V23z"
}));

// Star Icon - Custom
const StarIconSVG = ({
  size = 24,
  filled = true,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "starGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#fcd34d"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#f59e0b"
}))), /*#__PURE__*/React.createElement("path", {
  fill: filled ? "url(#starGrad)" : "none",
  stroke: filled ? "none" : "#f59e0b",
  strokeWidth: "2",
  d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
}));

// Trophy Icon - Custom
const TrophyIconSVG = ({
  size = 40,
  className = ''
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 100 100",
  width: size,
  height: size,
  className: className
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "trophyGrad",
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#fcd34d"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#f59e0b"
}))), /*#__PURE__*/React.createElement("path", {
  d: "M25,20 L75,20 L70,55 Q65,70 50,70 Q35,70 30,55 Z",
  fill: "url(#trophyGrad)"
}), /*#__PURE__*/React.createElement("path", {
  d: "M25,25 Q10,25 10,40 Q10,55 25,50",
  stroke: "#f59e0b",
  strokeWidth: "6",
  fill: "none"
}), /*#__PURE__*/React.createElement("path", {
  d: "M75,25 Q90,25 90,40 Q90,55 75,50",
  stroke: "#f59e0b",
  strokeWidth: "6",
  fill: "none"
}), /*#__PURE__*/React.createElement("rect", {
  x: "40",
  y: "70",
  width: "20",
  height: "10",
  fill: "#f59e0b"
}), /*#__PURE__*/React.createElement("rect", {
  x: "30",
  y: "80",
  width: "40",
  height: "8",
  rx: "2",
  fill: "#fcd34d"
}), /*#__PURE__*/React.createElement("path", {
  d: "M50,30 L53,40 L63,40 L55,47 L58,57 L50,51 L42,57 L45,47 L37,40 L47,40 Z",
  fill: "white"
}));

// Helper function to get level icon and info
const getLevelInfo = xp => {
  if (xp >= 5000) return {
    name: 'Bull',
    Icon: BullIcon,
    color: 'from-amber-400 to-orange-500'
  };
  if (xp >= 2000) return {
    name: 'Wolf',
    Icon: WolfIcon,
    color: 'from-purple-400 to-purple-600'
  };
  if (xp >= 500) return {
    name: 'Trader',
    Icon: TraderIcon,
    color: 'from-blue-400 to-blue-600'
  };
  return {
    name: 'Rookie',
    Icon: RookieIcon,
    color: 'from-slate-400 to-slate-500'
  };
};

// ========== GLOBAL DESIGN SYSTEM ==========
const GlobalStyles = () => /*#__PURE__*/React.createElement("style", null, `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

    body, button, input, textarea { font-family: 'Outfit', system-ui, sans-serif; }
    .fl-display { font-family: 'Space Grotesk', system-ui, sans-serif !important; letter-spacing: 0.06em; }
    .fl-mono { font-family: 'JetBrains Mono', monospace !important; font-variant-numeric: tabular-nums; }

    @keyframes flShimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
    @keyframes flTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes flGlowPulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .8; transform: scale(1.08); } }
    @keyframes flGridPan { 0% { background-position: 0 0; } 100% { background-position: 48px 48px; } }
    @keyframes flCandle { 0% { transform: scaleY(0); opacity: 0; } 100% { transform: scaleY(1); opacity: 1; } }
    @keyframes flFadeUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes flSweep { 0% { transform: translateX(-160%) skewX(-20deg); } 60%,100% { transform: translateX(380%) skewX(-20deg); } }
    @keyframes flQuizIn { 0% { opacity: 0; transform: translateX(34px); } 100% { opacity: 1; transform: none; } }
    @keyframes flOptIn { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: none; } }
    .fl-quiz-in { animation: flQuizIn .38s cubic-bezier(.22,1,.36,1) both; }
    .fl-opt-in { animation: flOptIn .45s cubic-bezier(.22,1,.36,1) both; }
    @keyframes flFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

    .fl-gold-text {
      background: linear-gradient(110deg, #d97706 10%, #f5d061 35%, #fff3c4 50%, #e8b931 65%, #d97706 90%);
      background-size: 200% auto;
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: flShimmer 4.5s linear infinite;
    }
    .fl-glass {
      background: rgba(13, 20, 38, 0.62);
      backdrop-filter: blur(20px) saturate(1.3);
      -webkit-backdrop-filter: blur(20px) saturate(1.3);
      border: 1px solid rgba(232, 185, 49, 0.14);
    }
    .fl-grid-bg {
      background-image:
        linear-gradient(rgba(232,185,49,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(232,185,49,.045) 1px, transparent 1px);
      background-size: 48px 48px;
      animation: flGridPan 14s linear infinite;
    }
    .fl-card-hover { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease, border-color .25s ease; }
    .fl-card-hover:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 14px 36px -14px rgba(232,185,49,.4); }
    .fl-card-hover:active:not(:disabled) { transform: translateY(-1px) scale(.99); }
    .fl-fade-up { animation: flFadeUp .55s cubic-bezier(.22,1,.36,1) both; }
    .fl-float { animation: flFloat 4s ease-in-out infinite; }
    .fl-sweep { position: relative; overflow: hidden; }
    .fl-sweep::after {
      content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 45%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
      animation: flSweep 3.4s cubic-bezier(.4,0,.2,1) infinite; pointer-events: none;
    }
    .fl-ticker-track { display: flex; width: max-content; animation: flTicker 32s linear infinite; }
    .fl-ticker-track:hover { animation-play-state: paused; }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(232,185,49,.22); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(232,185,49,.45); }
    button { -webkit-tap-highlight-color: transparent; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    }
  `);

// Ticker tape stile mercati: i topic CFA quotati come indici (variazione = peso d'esame)
const TICKER_ITEMS = [{
  sym: 'ETHICS',
  chg: '+15.0%',
  up: true
}, {
  sym: 'QUANT',
  chg: '+9.2%',
  up: true
}, {
  sym: 'ECON',
  chg: '+8.1%',
  up: true
}, {
  sym: 'FRA',
  chg: '+14.5%',
  up: true
}, {
  sym: 'CORP ISS',
  chg: '+7.0%',
  up: true
}, {
  sym: 'EQUITY',
  chg: '+12.4%',
  up: true
}, {
  sym: 'FIXED INC',
  chg: '+13.8%',
  up: true
}, {
  sym: 'DERIV',
  chg: '-6.2%',
  up: false
}, {
  sym: 'ALT INV',
  chg: '+7.7%',
  up: true
}, {
  sym: 'PM',
  chg: '-5.9%',
  up: false
}];
const TickerTape = () => /*#__PURE__*/React.createElement("div", {
  className: "overflow-hidden border-y",
  style: {
    borderColor: 'rgba(232,185,49,0.14)',
    background: 'rgba(5,8,16,0.6)'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "fl-ticker-track py-1.5"
}, [...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => /*#__PURE__*/React.createElement("span", {
  key: i,
  className: "fl-mono text-[11px] flex items-center gap-1.5 px-4 whitespace-nowrap"
}, /*#__PURE__*/React.createElement("span", {
  className: "text-slate-400 font-semibold"
}, t.sym), /*#__PURE__*/React.createElement("span", {
  className: t.up ? 'text-emerald-400' : 'text-rose-400'
}, t.up ? '▲' : '▼', " ", t.chg)))));

// Candlestick chart animato (splash / sfondi)
const CandleChart = ({
  className = ''
}) => {
  const candles = [{
    h: 22,
    y: 60,
    up: true,
    w: 16,
    d: 0
  }, {
    h: 30,
    y: 48,
    up: true,
    w: 16,
    d: .12
  }, {
    h: 18,
    y: 52,
    up: false,
    w: 16,
    d: .24
  }, {
    h: 34,
    y: 36,
    up: true,
    w: 16,
    d: .36
  }, {
    h: 26,
    y: 30,
    up: true,
    w: 16,
    d: .48
  }, {
    h: 16,
    y: 38,
    up: false,
    w: 16,
    d: .6
  }, {
    h: 40,
    y: 14,
    up: true,
    w: 16,
    d: .72
  }, {
    h: 32,
    y: 8,
    up: true,
    w: 16,
    d: .84
  }];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 100",
    className: className,
    preserveAspectRatio: "none"
  }, candles.map((c, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: i * 25 + 12,
    x2: i * 25 + 12,
    y1: c.y - 6,
    y2: c.y + c.h + 6,
    stroke: c.up ? '#34d399' : '#fb7185',
    strokeWidth: "1.5",
    opacity: "0.7",
    style: {
      animation: `flCandle .5s ${c.d}s cubic-bezier(.22,1,.36,1) both`,
      transformOrigin: `${i * 25 + 12}px ${c.y + c.h / 2}px`
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: i * 25 + 12 - c.w / 2,
    y: c.y,
    width: c.w,
    height: c.h,
    rx: "2",
    fill: c.up ? '#10b981' : '#f43f5e',
    opacity: "0.85",
    style: {
      animation: `flCandle .6s ${c.d}s cubic-bezier(.22,1,.36,1) both`,
      transformOrigin: `${i * 25 + 12}px ${c.y + c.h}px`
    }
  }))), /*#__PURE__*/React.createElement("polyline", {
    points: "12,68 37,55 62,58 87,42 112,38 137,44 162,22 187,16",
    fill: "none",
    stroke: "#f5d061",
    strokeWidth: "1.5",
    strokeDasharray: "300",
    strokeDashoffset: "300",
    opacity: "0.9",
    style: {
      animation: 'flDash 1.6s .3s ease-out forwards'
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes flDash { to { stroke-dashoffset: 0; } }`));
};

// ========== SPLASH SCREEN ==========
function SplashScreen({
  onComplete
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 200), setTimeout(() => setPhase(2), 700), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1800), setTimeout(() => setPhase(5), 2600), setTimeout(() => onComplete(), 3200)];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);
  return /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${phase >= 5 ? 'opacity-0' : 'opacity-100'}`,
    style: {
      background: 'radial-gradient(ellipse at 50% 0%, #1a1207 0%, #070b14 55%, #04060d 100%)'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 fl-grid-bg opacity-60"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 bottom-0 h-1/2 opacity-30"
  }, /*#__PURE__*/React.createElement(CandleChart, {
    className: "w-full h-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[420px] h-[420px] rounded-full blur-[120px]",
    style: {
      background: 'rgba(232,185,49,0.18)',
      animation: 'flGlowPulse 3.5s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `transition-all duration-700 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-float drop-shadow-2xl"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 128,
    mood: "celebrating"
  }))), /*#__PURE__*/React.createElement("h1", {
    className: `fl-display fl-gold-text text-6xl font-bold mt-7 transition-all duration-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
  }, "FINLEARN"), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 mt-4 transition-all duration-500 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-px w-8",
    style: {
      background: 'linear-gradient(90deg, transparent, #e8b931)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-amber-200/70 text-[11px] tracking-[0.35em] uppercase"
  }, "Bull Market Your Knowledge"), /*#__PURE__*/React.createElement("span", {
    className: "h-px w-8",
    style: {
      background: 'linear-gradient(90deg, #e8b931, transparent)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: `relative w-72 h-[3px] mt-9 rounded-full overflow-hidden transition-all duration-500 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`,
    style: {
      background: 'rgba(232,185,49,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-1000 ease-out",
    style: {
      width: phase >= 4 ? '100%' : '0%',
      background: 'linear-gradient(90deg, #d97706, #f5d061, #fff3c4)'
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: `fl-mono mt-6 text-amber-500/40 text-[10px] tracking-[0.25em] transition-opacity duration-500 ${phase >= 4 ? 'opacity-100' : 'opacity-0'}`
  }, "v13 \xB7 CFA LEVEL II EDITION")));
}

// ========== DEMO AUTH SYSTEM ==========
// Simula Firebase per testing - i dati sono salvati in localStorage
const DEMO_MODE = true;
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: callback => {
    const saved = localStorage.getItem('finlearn_user');
    if (saved) {
      mockAuth.currentUser = JSON.parse(saved);
      setTimeout(() => callback(mockAuth.currentUser), 100);
    } else {
      setTimeout(() => callback(null), 100);
    }
    return () => {};
  },
  signInWithEmailAndPassword: async (email, password) => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('finlearn_users') || '{}');
    const userKey = email.toLowerCase();
    if (!users[userKey]) throw {
      code: 'auth/user-not-found'
    };
    if (users[userKey].password !== password) throw {
      code: 'auth/wrong-password'
    };
    mockAuth.currentUser = users[userKey].user;
    localStorage.setItem('finlearn_user', JSON.stringify(mockAuth.currentUser));
    return {
      user: mockAuth.currentUser
    };
  },
  createUserWithEmailAndPassword: async (email, password, displayName) => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('finlearn_users') || '{}');
    const userKey = email.toLowerCase();
    if (users[userKey]) throw {
      code: 'auth/email-already-in-use'
    };
    const uid = 'user_' + Date.now();
    const user = {
      uid,
      email,
      displayName,
      photoURL: null
    };
    users[userKey] = {
      user,
      password
    };
    localStorage.setItem('finlearn_users', JSON.stringify(users));
    mockAuth.currentUser = user;
    localStorage.setItem('finlearn_user', JSON.stringify(user));
    return {
      user
    };
  },
  signInWithGoogle: async () => {
    await new Promise(r => setTimeout(r, 1000));
    const uid = 'google_' + Date.now();
    const user = {
      uid,
      email: 'demo@gmail.com',
      displayName: 'Google User',
      photoURL: 'https://ui-avatars.com/api/?name=G&background=f59e0b&color=fff'
    };
    mockAuth.currentUser = user;
    localStorage.setItem('finlearn_user', JSON.stringify(user));
    return {
      user
    };
  },
  signOut: async () => {
    mockAuth.currentUser = null;
    localStorage.removeItem('finlearn_user');
  }
};
const mockDb = {
  getData: uid => {
    const data = localStorage.getItem('finlearn_data_' + uid);
    return data ? JSON.parse(data) : null;
  },
  setData: (uid, data) => {
    localStorage.setItem('finlearn_data_' + uid, JSON.stringify(data));
  }
};
const getErrorMessage = code => {
  const messages = {
    'auth/email-already-in-use': 'Email già registrata. Prova ad accedere.',
    'auth/user-not-found': 'Account non trovato. Registrati!',
    'auth/wrong-password': 'Password errata.',
    'auth/weak-password': 'Password troppo debole (min 6 caratteri).',
    'auth/invalid-email': 'Email non valida.'
  };
  return messages[code] || 'Errore. Riprova.';
};

// ========== LOADING SCREEN ==========
function LoadingScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center overflow-hidden",
    style: {
      background: 'radial-gradient(ellipse at 50% 30%, #15100a 0%, #070b14 60%, #04060d 100%)'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 fl-grid-bg opacity-50"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-center relative z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-float inline-block"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 84,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "fl-display fl-gold-text text-3xl font-bold mt-3"
  }, "FINLEARN"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5 mt-4"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "w-1.5 h-1.5 rounded-full bg-amber-400",
    style: {
      animation: `flGlowPulse 1s ${i * 0.18}s ease-in-out infinite`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fl-mono text-amber-500/50 text-[10px] tracking-[0.25em] mt-4 uppercase"
  }, "Caricamento mercati\u2026")));
}

// ========== AUTH SCREEN ==========
function AuthScreen({
  onAuth
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email non valida.');
      return;
    }
    if (password.length < 6) {
      setError('Password min 6 caratteri.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }
    if (mode === 'register' && displayName.trim().length < 2) {
      setError('Inserisci il tuo nome.');
      return;
    }
    setLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await mockAuth.signInWithEmailAndPassword(email, password);
      } else {
        result = await mockAuth.createUserWithEmailAndPassword(email, password, displayName.trim());
      }
      // Load or create user data
      let userData = mockDb.getData(result.user.uid);
      if (!userData) {
        userData = {
          stats: {
            xp: 0,
            coins: 0,
            level: 1,
            streak: 0,
            quizzes: 0,
            correct: 0,
            cards: 0
          },
          completedLessons: [],
          activeLesson: 1,
          settings: {
            timerEnabled: false
          }
        };
        mockDb.setData(result.user.uid, userData);
      }
      onAuth(result.user, userData);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await mockAuth.signInWithGoogle();
      let userData = mockDb.getData(result.user.uid);
      if (!userData) {
        userData = {
          stats: {
            xp: 0,
            coins: 0,
            level: 1,
            streak: 0,
            quizzes: 0,
            correct: 0,
            cards: 0
          },
          completedLessons: [],
          activeLesson: 1,
          settings: {
            timerEnabled: false
          }
        };
        mockDb.setData(result.user.uid, userData);
      }
      onAuth(result.user, userData);
    } catch (err) {
      setError('Errore Google login');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center p-4 overflow-hidden relative",
    style: {
      background: 'radial-gradient(ellipse at 50% -10%, #18120a 0%, #070b14 55%, #04060d 100%)'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 fl-grid-bg opacity-40"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full blur-[130px]",
    style: {
      background: 'rgba(232,185,49,0.12)',
      animation: 'flGlowPulse 5s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 bottom-0 h-2/5 opacity-[0.12] pointer-events-none"
  }, /*#__PURE__*/React.createElement(CandleChart, {
    className: "w-full h-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md relative z-10 fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-float inline-block mb-1"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 80,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "fl-display fl-gold-text text-4xl font-bold"
  }, "FINLEARN"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-px w-6",
    style: {
      background: 'linear-gradient(90deg, transparent, #e8b931)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-amber-200/60 text-[10px] tracking-[0.3em] uppercase"
  }, "Bull Market Your Knowledge"), /*#__PURE__*/React.createElement("span", {
    className: "h-px w-6",
    style: {
      background: 'linear-gradient(90deg, #e8b931, transparent)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-3xl shadow-2xl p-6",
    style: {
      boxShadow: '0 30px 70px -30px rgba(0,0,0,.8)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleGoogle,
    disabled: loading,
    className: "w-full flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 fl-card-hover"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#4285F4",
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FBBC05",
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
  })), "Continua con Google"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 my-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px",
    style: {
      background: 'linear-gradient(90deg, transparent, rgba(148,163,184,.3))'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-xs fl-mono tracking-widest uppercase"
  }, "oppure"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px",
    style: {
      background: 'linear-gradient(90deg, rgba(148,163,184,.3), transparent)'
    }
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, mode === 'register' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Nome"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: displayName,
    onChange: e => setDisplayName(e.target.value),
    placeholder: "Come ti chiami?",
    className: "w-full px-4 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Email"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Mail, {
    size: 18,
    className: "absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50"
  }), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "la.tua@email.com",
    className: "w-full pl-11 pr-4 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Lock, {
    size: 18,
    className: "absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50"
  }), /*#__PURE__*/React.createElement("input", {
    type: showPassword ? 'text' : 'password',
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full pl-11 pr-12 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(!showPassword),
    className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition"
  }, showPassword ? /*#__PURE__*/React.createElement(EyeOff, {
    size: 18
  }) : /*#__PURE__*/React.createElement(Eye, {
    size: 18
  })))), mode === 'register' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-slate-400 mb-1.5 tracking-wide uppercase"
  }, "Conferma Password"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: confirmPassword,
    onChange: e => setConfirmPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full px-4 py-3 rounded-2xl focus:outline-none text-white placeholder-slate-600 transition",
    style: {
      background: 'rgba(5,8,16,0.5)',
      border: '1px solid rgba(232,185,49,0.16)'
    },
    onFocus: e => e.target.style.borderColor = '#e8b931',
    onBlur: e => e.target.style.borderColor = 'rgba(232,185,49,0.16)'
  })), error && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-400 text-sm"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    size: 18
  }), error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full py-3.5 text-white font-bold rounded-2xl transition disabled:opacity-50 fl-card-hover fl-sweep",
    style: {
      background: 'linear-gradient(110deg, #d97706, #f59e0b 50%, #d97706)',
      boxShadow: '0 12px 30px -10px rgba(245,158,11,.5)'
    }
  }, loading ? 'Caricamento…' : mode === 'login' ? 'Accedi' : 'Registrati')), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-sm"
  }, mode === 'login' ? 'Non hai un account? ' : 'Hai già un account? '), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMode(mode === 'login' ? 'register' : 'login');
      setError(null);
    },
    className: "text-amber-400 font-semibold hover:text-amber-300 transition"
  }, mode === 'login' ? 'Registrati' : 'Accedi'))), DEMO_MODE && /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-4 text-slate-600 text-xs fl-mono tracking-wide"
  }, "DEMO MODE \xB7 dati salvati localmente")));
}

// ========== MATH FORMULA ==========
function MathFormula({
  formula,
  display = false
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.katex) {
      try {
        window.katex.render(formula, ref.current, {
          displayMode: display,
          throwOnError: false
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = formula;
      }
    }
  }, [formula, display]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: display ? "block my-2" : "inline"
  });
}

// ========== EQUITY VALUATION · READING 22-27 (dati: teoria LOS-completa, 180 flashcard, 65 quiz) ==========
const EQ_READINGS = [/* ================================================================== R22 */
{
  n: 22,
  key: 'r22',
  title: 'Equity Valuation: Applications and Processes',
  sub: 'Valore intrinseco, misure di valore, processo e modelli',
  weight: '11–14%',
  theory: [{
    code: '22(a)',
    title: 'Valore intrinseco e fonti del mispricing',
    imp: 'ALTA',
    blocks: [{
      p: "La valutazione stima il valore di un asset su tre basi: variabili sui rendimenti futuri (valutazione assoluta), confronto con asset simili (relativa), o stime di liquidazione immediata."
    }, {
      h: 'Valore intrinseco & mispricing percepito',
      p: "Il valore intrinseco è il valore stimato da un investitore con comprensione completa dell'asset. Gli investitori operano perché ritengono che differisca dal prezzo: è il mispricing percepito, un'opportunità di profitto quando il prezzo converge al valore intrinseco. L'investitore attivo cerca un rendimento aggiustato per il rischio positivo (alfa o abnormal return)."
    }, {
      f: 'V_E - P = (V - P) + (V_E - V)',
      cap: 'Mispricing percepito = mispricing reale (errore di mercato) + errore di valutazione (errore dell\u2019analista). V_E = valore stimato · P = prezzo · V = valore intrinseco reale.'
    }]
  }, {
    code: '22(b)',
    title: 'Going concern vs. valore di liquidazione',
    imp: 'MEDIA',
    blocks: [{
      p: "L'ipotesi di continuità (going concern) assume che l'azienda continui a operare: il valore corrispondente è il going concern value. Il valore di liquidazione è il valore se l'azienda cessasse e gli asset fossero venduti singolarmente — appropriato in difficoltà finanziaria."
    }, {
      p: "Di norma going concern > liquidazione, perché incorpora competenze manageriali e sinergie. Eccezione: aziende in perdita continuativa. I beni non deperibili, vendibili in modo ordinato, hanno un orderly liquidation value più alto."
    }]
  }, {
    code: '22(c)',
    title: 'Definizioni di valore',
    imp: 'ALTA',
    blocks: [{
      h: 'Fair value',
      p: "Prezzo in una transazione ordinata tra partecipanti al mercato. È il valore usato nel financial reporting."
    }, {
      h: 'Fair market value',
      p: "Valore tra compratore e venditore non obbligati, entrambi consapevoli. Nel lungo periodo i prezzi tendono al fair value."
    }, {
      h: 'Investment value',
      p: "Valore per uno specifico investitore, più alto grazie alle sinergie. È la misura più adatta per le acquisizioni strategiche, mentre il valore intrinseco è il concetto rilevante per le azioni quotate."
    }]
  }, {
    code: '22(d)',
    title: 'Applicazioni della valutazione azionaria',
    imp: 'MEDIA',
    blocks: [{
      list: ['Selezione titoli (sotto/sopra/correttamente valutati).', 'Dedurre le aspettative di mercato implicite nel prezzo.', 'Valutare eventi societari: fusioni, acquisizioni, divestiture, spin-off.', 'Fornire fairness opinion.', 'Valutare strategie e modelli di business.', 'Comunicare con analisti e azionisti.', 'Valutare aziende private (transazionale / fiscale).', 'Compensi azionari (es. restricted stock grants).']
    }, {
      h: 'Eventi societari',
      p: "Merger: combinazione di due aziende. Acquisizione: l'acquirer compra le azioni del target. Divestiture: cessione di asset/business unit. Spin-off: una divisione diventa entità separata, con azioni emesse pro-quota agli azionisti attuali."
    }]
  }, {
    code: '22(e)',
    title: 'Il processo di valutazione',
    imp: 'ALTA',
    blocks: [{
      h: 'I 5 passi',
      list: ['Comprendere il business.', "Prevedere la performance dell'azienda.", 'Selezionare il modello appropriato.', 'Usare le previsioni nella valutazione.', 'Applicare le conclusioni.']
    }, {
      h: 'Le 5 forze di Porter',
      p: "Attrattività del settore: intensità della rivalità, nuovi entranti (barriere), sostituti, potere dei fornitori, potere degli acquirenti."
    }, {
      h: 'Strategie competitive',
      p: "Tre vie per la sovra-performance: cost leadership, differenziazione (prodotti unici, margini più alti), focus (vantaggio entro un segmento)."
    }, {
      h: 'Qualità degli utili',
      p: "Quality of earnings: quota di reddito dalle attività core. Scomporre l'utile in accrual (competenza) e cash: alti accrual = qualità inferiore e ROA futuro più basso. Evitare di estrapolare la performance passata: tende a convergere verso la crescita dell'economia."
    }]
  }, {
    code: '22(f)',
    title: 'Modelli di valutazione',
    imp: 'ALTA',
    blocks: [{
      h: 'Modelli assoluti',
      p: "Stimano il valore intrinseco. Includono i modelli del valore attuale (DCF) e quelli basati sugli asset. I flussi di cassa DCF: dividendi, FCFE, FCFF, residual income."
    }, {
      h: 'Modelli relativi (method of comparables)',
      p: "Valore stimato rispetto a un comparabile usando multipli di prezzo (P/E, P/B, P/CF) o enterprise multiples. Il P/E è il più usato: un P/E più basso del comparabile = relativamente sottovalutato, assumendo che il comparabile sia correttamente prezzato."
    }]
  }, {
    code: '22(g)',
    title: 'Sum-of-the-parts & conglomerate discount',
    imp: 'MEDIA',
    blocks: [{
      p: "La sum-of-the-parts valuta un'azienda aggregando il valore dei segmenti come indipendenti: il risultato è il breakup value (private market value). Adatta a segmenti diversi e non correlati."
    }, {
      p: "Lo sconto di conglomerato si applica per: inefficienza nell'allocazione del capitale tra divisioni; fattori endogeni; errori di misurazione. Un breakup value > going concern value può spingere verso uno spin-off."
    }]
  }, {
    code: '22(h)',
    title: 'Scelta del modello',
    imp: 'ALTA',
    blocks: [{
      h: 'Le 3 caratteristiche',
      list: ["Coerente con le caratteristiche dell'azienda (es. asset-based per risorse naturali).", 'Appropriato data disponibilità e qualità dei dati (no DDM senza dividendi; no multipli con utili negativi).', 'Coerente con lo scopo (chi cerca il controllo preferisce un modello FCF).']
    }, {
      p: "Gli analisti usano spesso più modelli insieme, assegnando pesi diversi in base alla loro appropriatezza."
    }]
  }],
  cards: [{
    los: '22a',
    q: "Cos'è il valore intrinseco?",
    a: "Il valore di un asset stimato da un investitore con comprensione ipoteticamente completa delle sue caratteristiche d'investimento — distinto da prezzo di mercato o valore contabile."
  }, {
    los: '22a',
    q: 'Scomponi il mispricing percepito.',
    a: "Mispricing percepito (V_E − P) = mispricing reale (V − P, errore di mercato) + errore di valutazione (V_E − V, errore dell'analista)."
  }, {
    los: '22a',
    q: "Cos'è l'alfa (abnormal return)?",
    a: "Il rendimento aggiustato per il rischio positivo che l'investitore attivo cerca sfruttando il mispricing percepito."
  }, {
    los: '22a',
    q: 'Cosa implica la teoria dei mercati efficienti per la valutazione?',
    a: "Valore intrinseco = prezzo di mercato: nessuno sosterrebbe i costi dell'analisi senza attendersi rendimenti più elevati."
  }, {
    los: '22b',
    q: 'Going concern vs liquidation value: quale è di norma più alto?',
    a: "Il going concern value, perché incorpora competenze manageriali e sinergie tra asset. Eccezione: aziende in perdita continuativa."
  }, {
    los: '22b',
    q: "Cos'è l'orderly liquidation value?",
    a: "Il valore di liquidazione ottenibile quando i beni (non deperibili) possono essere venduti in modo ordinato, con più tempo a disposizione: è più alto di una vendita forzata."
  }, {
    los: '22c',
    q: 'Definisci il fair value.',
    a: "Il prezzo che si riceverebbe vendendo un asset (o pagherebbe trasferendo una passività) in una transazione ordinata tra partecipanti al mercato. Usato nel financial reporting."
  }, {
    los: '22c',
    q: 'Quale misura per un acquirente strategico?',
    a: "L'investment value, perché incorpora le sinergie potenziali specifiche per quell'acquirente."
  }, {
    los: '22d',
    q: 'Divestiture vs spin-off?',
    a: "Divestiture = cessione di asset/business unit. Spin-off = una divisione diventa entità separata, con azioni emesse pro-quota agli azionisti attuali."
  }, {
    los: '22e',
    q: 'I 5 passi del processo di valutazione?',
    a: "1) Comprendere il business; 2) prevedere la performance; 3) selezionare il modello; 4) usare le previsioni nella valutazione; 5) applicare le conclusioni."
  }, {
    los: '22e',
    q: 'Le 5 forze di Porter?',
    a: "Intensità della rivalità, nuovi entranti (barriere all'ingresso), sostituti, potere dei fornitori, potere degli acquirenti."
  }, {
    los: '22e',
    q: "Cosa indica un'alta proporzione di accrual?",
    a: "Qualità degli utili inferiore: la componente cash è più persistente, e l'azienda tende ad avere un ROA futuro più basso."
  }, {
    los: '22f',
    q: 'I 4 flussi di cassa dei modelli del valore attuale?',
    a: "Dividendi, FCFE, FCFF e residual income."
  }, {
    los: '22g',
    q: "Cos'è il breakup value e quando segnala un'azione?",
    a: "Il valore da sum-of-the-parts (private market value). Se > going concern value, può spingere verso divestiture o spin-off."
  }, {
    los: '22h',
    q: 'I 3 criteri per scegliere un modello?',
    a: "1) Coerenza con le caratteristiche dell'azienda; 2) appropriatezza rispetto a disponibilità/qualità dei dati; 3) coerenza con lo scopo della valutazione."
  }, {
    los: '22a',
    q: 'Le tre basi su cui può poggiare una valutazione?',
    a: "1) Variabili legate ai rendimenti futuri (valutazione assoluta); 2) confronto con asset simili (valutazione relativa); 3) stime di liquidazione immediata."
  }, {
    los: '22a',
    q: 'Perché nei mercati efficienti nessuno farebbe analisi?',
    a: "Se valore intrinseco = prezzo, i costi dell'analisi non sarebbero compensati da rendimenti più elevati: l'analisi attiva ha senso solo se si attende un abnormal return."
  }, {
    los: '22b',
    q: 'Quando è appropriato usare il liquidation value?',
    a: "Per aziende in difficoltà finanziaria o in perdita continuativa, dove la cessazione delle operazioni e la vendita separata degli asset è lo scenario rilevante."
  }, {
    los: '22c',
    q: 'Fair value vs fair market value?',
    a: "Il fair value è il prezzo in una transazione ordinata tra partecipanti al mercato (financial reporting). Il fair market value è tra compratore e venditore non obbligati e pienamente informati — concetto usato spesso in ambito fiscale."
  }, {
    los: '22d',
    q: "Cos'è una fairness opinion?",
    a: "Un parere di congruità fornito da un terzo indipendente sul prezzo di una transazione (es. una fusione), basato su una valutazione."
  }, {
    los: '22d',
    q: "Cosa significa 'dedurre le aspettative di mercato'?",
    a: "Usare il prezzo corrente per ricavare le assunzioni implicite del mercato sui fondamentali (es. la crescita attesa), e confrontarle con le proprie stime."
  }, {
    los: '22e',
    q: 'A cosa serve la sensitivity analysis nel processo di valutazione?',
    a: "A determinare come una variazione di un input (es. crescita, margini, tasso) influisce sull'output della valutazione, sviluppando scenari appropriati."
  }, {
    los: '22e',
    q: 'Come ciascuna forza di Porter migliora la profittabilità?',
    a: "Bassa rivalità (pochi player, settore in crescita); alte barriere all'ingresso; pochi sostituti o switching cost elevati; molti fornitori (basso supplier power); molti consumatori (basso buyer power)."
  }, {
    los: '22e',
    q: 'Cost leadership vs differenziazione: effetti su costi e margini?',
    a: "Cost leadership: costi di produzione più bassi a prodotti comparabili, prezzi vicini alla media. Differenziazione: spese di vendita più alte ma margini lordi più alti grazie al premio di prezzo."
  }, {
    los: '22e',
    q: 'Top-down vs bottom-up forecasting?',
    a: "Top-down: dalle previsioni macro/di settore si scende all'azienda. Bottom-up: si parte dai dati a livello di singola azienda/segmento e si aggrega."
  }, {
    los: '22e',
    q: 'Quattro red flag di qualità degli utili?',
    a: "Ricavi riconosciuti troppo presto (es. bill & hold); riserve troppo alte/basse (crediti dubbi, ristrutturazioni); finanziamenti fuori bilancio (leasing, cartolarizzazioni); scoperto bancario classificato come flusso operativo."
  }, {
    los: '22f',
    q: 'Modelli del valore attuale vs asset-based?',
    a: "I present value (DCF) scontano i flussi futuri attesi; gli asset-based stimano il valore come somma dei valori delle attività al netto delle passività."
  }, {
    los: '22f',
    q: "L'assunzione chiave del method of comparables?",
    a: "Che il comparabile/benchmark sia correttamente prezzato: se il peer è mal prezzato, il giudizio relativo eredita quell'errore."
  }, {
    los: '22g',
    q: 'Quando la sum-of-the-parts è appropriata?',
    a: "Per aziende con segmenti diversi e non correlati, e per stimare il valore sbloccabile da spin-off, split-off o equity carve-out."
  }, {
    los: '22h',
    q: 'Perché chi cerca il controllo preferisce un modello FCF?',
    a: "Perché chi acquisisce il controllo può cambiare la politica dei dividendi: conta il free cash flow generabile, non i dividendi correnti."
  }],
  quiz: [{
    q: "Il valore di un asset data una comprensione ipoteticamente completa è con più probabilità:",
    opts: ['Fair market value', 'Valore intrinseco', 'Investment value'],
    correct: 1,
    exp: "Il valore intrinseco si basa su una comprensione completa dell'asset. Il fair market value è il prezzo tra parti non obbligate; l'investment value considera le sinergie."
  }, {
    q: "La misura di valore più bassa è con più probabilità:",
    opts: ['Investment value', 'Liquidation value', 'Going concern value'],
    correct: 1,
    exp: "Il liquidation value è il più basso: valore se l'azienda cessasse e vendesse gli asset singolarmente."
  }, {
    q: "La misura più appropriata per un acquirente strategico è:",
    opts: ['Valore intrinseco', 'Investment value', 'Fair market value'],
    correct: 1,
    exp: "L'investment value tiene conto delle sinergie specifiche per l'acquirente."
  }, {
    q: "Quale è con minore probabilità un'applicazione della valutazione azionaria?",
    opts: ['Valutare strategie di business', 'Selezione titoli', 'Una fusione'],
    correct: 2,
    exp: "Una fusione in sé non lo è: lo è valutare l'impatto di eventi come le fusioni."
  }, {
    q: "Quale è una delle cinque forze di Porter?",
    opts: ['Potere dei fornitori', 'Approccio top-down', 'Cost leadership'],
    correct: 0,
    exp: "Il potere dei fornitori è una delle 5 forze. Top-down è un metodo di previsione; cost leadership è una strategia competitiva."
  }, {
    q: "Un'azienda con alti accrual rispetto alla componente cash ha con più probabilità:",
    opts: ['Utili di qualità superiore', 'ROA futuro più basso', 'ROA futuro più alto'],
    correct: 1,
    exp: "Alti accrual = qualità degli utili inferiore: la componente cash è più persistente, il ROA futuro tende a essere più basso."
  }, {
    q: "La separazione di una divisione in una nuova entità con azioni emesse pro-quota agli azionisti è:",
    opts: ['Una divestiture', 'Uno spin-off', "Un'acquisizione"],
    correct: 1,
    exp: "È uno spin-off. La divestiture è la cessione di asset/business unit a terzi."
  }, {
    q: "Quale flusso di cassa NON appartiene ai modelli del valore attuale?",
    opts: ['Residual income', 'FCFF', 'Enterprise multiple'],
    correct: 2,
    exp: "L'enterprise multiple appartiene alla valutazione relativa, non ai modelli del valore attuale."
  }, {
    q: "Ragione più probabile per uno sconto di conglomerato:",
    opts: ["Inefficienza nell'allocazione del capitale", 'Sum-of-the-parts valuation', 'Breakup value'],
    correct: 0,
    exp: "L'inefficienza nell'allocazione del capitale tra divisioni è una delle cause. La SOTP è il metodo; il breakup value è il risultato."
  }, {
    q: "Criterio meno probabile per scegliere un approccio di valutazione:",
    opts: ["Coerenza con le caratteristiche dell'azienda", 'Disponibilità e qualità dei dati', 'Modello di valutazione relativa'],
    correct: 2,
    exp: "Il modello relativo è esso stesso un approccio, non un criterio di scelta."
  }]
}, /* ================================================================== R23 */
{
  n: 23,
  key: 'r23',
  title: 'Discounted Dividend Valuation',
  sub: 'DDM, Gordon, PVGO, P/E giustificati, multistadio, SGR',
  weight: '11–14%',
  theory: [{
    code: '23(a)',
    title: 'DCF: dividendi, FCF, residual income',
    imp: 'ALTA',
    blocks: [{
      p: "Il valore intrinseco è il valore attuale dei flussi di cassa futuri attesi. I quattro passi: definire il flusso di cassa, prevederlo, scegliere la metodologia per il tasso, stimarlo."
    }, {
      f: 'V_0 = \\sum_{t=1}^{n} \\dfrac{CF_t}{(1+r)^t}',
      cap: 'Valore = valore attuale dei flussi di cassa futuri. r = tasso di rendimento richiesto.'
    }, {
      h: 'Quando usare il DDM',
      p: "L'azienda paga dividendi, c'è relazione stabile tra dividendi e profittabilità, e l'investitore assume una prospettiva di non-controllo (minoranza). Il FCF è preferito in prospettiva di controllo; il residual income quando i dividendi sono assenti o i FCF attesi sono negativi."
    }]
  }, {
    code: '23(b)',
    title: 'DDM single e multiperiodo',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = \\dfrac{D_1 + P_1}{(1+r)}',
      cap: 'Periodo singolo: PV del dividendo + PV del prezzo di vendita.'
    }, {
      f: 'V_0 = \\sum_{t=1}^{n} \\dfrac{D_t}{(1+r)^t} + \\dfrac{P_n}{(1+r)^n}',
      cap: 'Periodo multiplo (n periodi).'
    }, {
      f: 'V_0 = \\sum_{t=1}^{\\infty} \\dfrac{D_t}{(1+r)^t}',
      cap: 'Orizzonte indefinito: PV di tutti i dividendi futuri.'
    }]
  }, {
    code: '23(c)',
    title: 'Gordon Growth Model',
    imp: 'ALTA',
    blocks: [{
      p: "Assume dividendi in crescita indefinita a tasso costante g, con r > g. r è detto capitalization rate."
    }, {
      f: 'V_0 = \\dfrac{D_0(1+g)}{r-g} = \\dfrac{D_1}{r-g}',
      cap: 'Es.: D₀ = $5, g = 4%, r = 8% → V₀ = 5,20/0,04 = $130.'
    }]
  }, {
    code: '23(d)',
    title: 'Azione privilegiata perpetua a tasso fisso',
    imp: 'MEDIA',
    blocks: [{
      f: 'V_0 = \\dfrac{D_p}{r_p}',
      cap: 'g = 0. Es.: par $100, dividendo 6%, r = 8% → 6/0,08 = $75.'
    }]
  }, {
    code: '23(e)',
    title: 'Tasso di crescita implicito',
    imp: 'MEDIA',
    blocks: [{
      p: "Dato prezzo, dividendo e r, si deduce g invertendo il Gordon model, per valutarne la plausibilità rispetto alle attese."
    }, {
      f: 'P = \\dfrac{D_0(1+g)}{r-g} \\;\\Rightarrow\\; g',
      cap: 'Es.: D₀ = $3, r = 11%, P = $45 → g ≈ 4,06%.'
    }]
  }, {
    code: '23(f)',
    title: 'PVGO — opportunità di crescita',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = \\dfrac{E_1}{r} + PVGO',
      cap: 'Valore = azienda no-growth (E₁/r) + valore attuale delle opportunità di crescita.'
    }, {
      f: '\\dfrac{P_0}{E_1} = \\dfrac{1}{r} + \\dfrac{PVGO}{E_1}',
      cap: 'Il P/E si scompone in componente no-growth (1/r) + componente crescita.'
    }, {
      p: "La crescita aumenta la ricchezza solo se gli utili reinvestiti rendono più del costo opportunità dei fondi. Le aziende no-growth dovrebbero distribuire tutto in dividendi."
    }]
  }, {
    code: '23(g)',
    title: 'P/E giustificati (trailing & leading)',
    imp: 'ALTA',
    blocks: [{
      f: '\\dfrac{P_0}{E_0} = \\dfrac{(1-b)(1+g)}{r-g}',
      cap: 'P/E trailing giustificato. b = retention ratio; (1−b) = payout.'
    }, {
      f: '\\dfrac{P_0}{E_1} = \\dfrac{1-b}{r-g}',
      cap: 'P/E leading giustificato.'
    }]
  }, {
    code: '23(h)',
    title: 'Forza e limiti del Gordon model',
    imp: 'MEDIA',
    blocks: [{
      h: 'Forza',
      list: ['Semplice da implementare.', 'Adatto ad aziende mature che pagano dividendi.', 'Utile per giudicare un intero mercato e per lo stadio finale dei modelli multistadio.']
    }, {
      h: 'Limiti',
      list: ['Molto sensibile a g e r (specie quando r−g è piccolo).', 'Non adatto da solo ad aziende in alta crescita.', 'Inapplicabile senza dividendi.']
    }]
  }, {
    code: '23(i)',
    title: 'Le fasi di crescita',
    imp: 'ALTA',
    blocks: [{
      h: 'Growth phase',
      p: "Espansione rapida, margini alti, alta crescita dell'EPS, FCF negativi per i forti investimenti, payout basso o nullo. Crescita supernormale."
    }, {
      h: 'Transition phase',
      p: "La crescita rallenta per concorrenza e saturazione, declina verso quella dell'economia. I FCF diventano positivi e il payout aumenta."
    }, {
      h: 'Mature phase',
      p: "Il ROE converge verso r; payout, crescita e ROE si stabilizzano a livelli sostenibili. Qui il Gordon model è appropriato. Il tasso è il mature growth rate."
    }]
  }, {
    code: '23(j-k)',
    title: 'Modelli multistadio & terminal value',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = \\sum_{t=1}^{n}\\dfrac{D_0(1+g_S)^t}{(1+r)^t} + \\dfrac{D_0(1+g_S)^n(1+g_L)}{(1+r)^n (r-g_L)}',
      cap: 'Two-stage DDM. g_S = crescita supernormale; g_L = crescita matura.'
    }, {
      f: 'V_0 = \\dfrac{D_0(1+g_L) + D_0\\,H\\,(g_S-g_L)}{r-g_L}',
      cap: 'H-model: la crescita declina linearmente da g_S a g_L. H = metà del periodo di alta crescita (anni).'
    }, {
      p: "Il terminal value si stima col Gordon model sul primo dividendo maturo, oppure applicando un multiplo (es. P/E) a un fondamentale alla data terminale. Il three-stage DDM combina due stadi di crescita distinti più lo stadio maturo (o un secondo stadio con declino lineare, à la H-model)."
    }]
  }, {
    code: '23(o)',
    title: 'Sustainable growth rate & DuPont',
    imp: 'ALTA',
    blocks: [{
      f: 'g = b \\times ROE',
      cap: 'SGR: tasso sostenibile a struttura del capitale invariata, senza nuova equity. b = retention ratio.'
    }, {
      f: 'ROE = \\dfrac{NI}{Sales}\\times\\dfrac{Sales}{Assets}\\times\\dfrac{Assets}{Equity}',
      cap: 'DuPont: margine × asset turnover × leva finanziaria.'
    }, {
      f: 'g = \\dfrac{NI-Div}{NI}\\times\\dfrac{NI}{Sales}\\times\\dfrac{Sales}{Assets}\\times\\dfrac{Assets}{Equity}',
      cap: 'Modello PRAT: retention (P) × margine (R) × turnover (A) × leva (T).'
    }]
  }],
  cards: [{
    los: '23a',
    q: 'Quando è più adatto il DDM?',
    a: "Quando l'azienda paga dividendi, esiste relazione stabile tra dividendi e profittabilità, e si assume una prospettiva di non-controllo (minoranza)."
  }, {
    los: '23a',
    q: 'I 4 passi di una valutazione DCF?',
    a: "1) Definire il flusso di cassa; 2) prevederlo; 3) scegliere la metodologia per il tasso di sconto; 4) stimare il tasso."
  }, {
    los: '23b',
    q: 'DDM a periodo singolo?',
    a: "V₀ = (D₁ + P₁)/(1+r): valore attuale del dividendo atteso più il prezzo di vendita atteso."
  }, {
    los: '23c',
    q: 'Formula del Gordon Growth Model e ipotesi chiave?',
    a: "V₀ = D₀(1+g)/(r−g) = D₁/(r−g). Ipotesi: dividendi in crescita costante e indefinita, r > g."
  }, {
    los: '23d',
    q: "Valore di un'azione privilegiata perpetua a tasso fisso?",
    a: "V₀ = D_p/r_p (g = 0). Es.: par $100, dividendo 6%, r 8% → 6/0,08 = $75."
  }, {
    los: '23e',
    q: 'A cosa serve il tasso di crescita implicito?',
    a: "Si inverte il Gordon model dato il prezzo di mercato per dedurre g, e valutarne la plausibilità rispetto alle attese dell'analista."
  }, {
    los: '23f',
    q: "Cos'è il PVGO?",
    a: "Il valore attuale delle opportunità di crescita: V₀ = E₁/r + PVGO. La crescita crea valore solo se il reinvestimento rende più del costo opportunità."
  }, {
    los: '23f',
    q: 'Scomposizione del P/E con il PVGO?',
    a: "P₀/E₁ = 1/r + PVGO/E₁: componente no-growth (1/r) + componente legata alla crescita."
  }, {
    los: '23g',
    q: 'P/E leading vs trailing giustificato?',
    a: "Leading: (1−b)/(r−g). Trailing: (1−b)(1+g)/(r−g) — il trailing è il leading × (1+g)."
  }, {
    los: '23h',
    q: 'Tre limiti del Gordon model?',
    a: "Molto sensibile a g e r; non adatto da solo ad alta crescita; inapplicabile senza dividendi."
  }, {
    los: '23i',
    q: 'Caratteristiche della growth phase?',
    a: "Espansione rapida, margini e crescita EPS alti, FCF negativi per i forti investimenti, payout basso o nullo: crescita supernormale."
  }, {
    los: '23i',
    q: 'Cosa accade nella transition phase?',
    a: "La crescita rallenta verso quella dell'economia per concorrenza e saturazione; i FCF diventano positivi e il payout aumenta."
  }, {
    los: '23j',
    q: "Cosa assume l'H-model?",
    a: "La crescita declina linearmente da g_S a g_L lungo 2H anni. V₀ = [D₀(1+g_L) + D₀·H·(g_S−g_L)]/(r−g_L)."
  }, {
    los: '23k',
    q: 'Due modi per stimare il terminal value?',
    a: "1) Gordon model sul primo dividendo della fase matura; 2) multiplo (es. P/E) applicato a un fondamentale alla data terminale."
  }, {
    los: '23o',
    q: 'Formula del sustainable growth rate?',
    a: "g = b × ROE: crescita sostenibile senza nuova equity e a struttura del capitale invariata."
  }, {
    los: '23o',
    q: 'Il modello PRAT?',
    a: "g = retention × margine di profitto × asset turnover × leva finanziaria — le tre componenti DuPont del ROE moltiplicate per la retention."
  }, {
    los: '23l',
    q: 'Procedura di calcolo con un modello multiperiodo?',
    a: "1) Prevedere i dividendi della fase di alta crescita e scontarli; 2) stimare il terminal value alla fine della fase (Gordon o multiplo); 3) scontare il terminal value a oggi; 4) sommare i due PV."
  }, {
    los: '23n',
    q: 'Come si stima il required return da un DDM?',
    a: "Si calcola l'IRR implicito nel prezzo di mercato. Col Gordon: r = D₁/P₀ + g. Es.: D₀ $1,50, P₀ $25, g 4% → r = 1,56/25 + 0,04 = 10,24%."
  }, {
    los: '23p',
    q: 'Giudizio su un\u2019azione col DDM?',
    a: "Prezzo di mercato > valore intrinseco DDM → sopravvalutata; uguale → correttamente valutata; minore → sottovalutata."
  }, {
    los: '23b',
    q: 'DDM multiperiodo con prezzo terminale?',
    a: "V₀ = Σ D_t/(1+r)^t + P_n/(1+r)^n: si scontano i dividendi dei primi n anni più il prezzo di vendita atteso alla fine dell'orizzonte."
  }, {
    los: '23c',
    q: 'Perché il Gordon richiede r > g?',
    a: "Con r ≤ g il denominatore (r−g) si annulla o diventa negativo e il valore esplode/perde senso. E quando r−g è piccolo, il valore è estremamente sensibile agli input."
  }, {
    los: '23c',
    q: "Cos'è il capitalization rate?",
    a: "Il tasso r usato nel Gordon growth model per capitalizzare il dividendo: il rendimento richiesto sull'equity."
  }, {
    los: '23e',
    q: 'Implied g: D₀ $3, r 11%, P $45. Quanto vale?',
    a: "45 = 3(1+g)/(0,11−g) → g ≈ 4,06%. Si verifica poi se è plausibile rispetto alle attese sull'azienda."
  }, {
    los: '23f',
    q: 'Quando la crescita NON crea valore?',
    a: "Quando gli utili reinvestiti rendono meno del costo opportunità dei fondi: in quel caso l'azienda dovrebbe distribuire tutto in dividendi (PVGO può essere negativo)."
  }, {
    los: '23g',
    q: 'Relazione tra trailing e leading P/E giustificato?',
    a: "Trailing = leading × (1+g): (1−b)(1+g)/(r−g) contro (1−b)/(r−g)."
  }, {
    los: '23i',
    q: 'Supernormal vs mature growth rate?',
    a: "Supernormal: crescita della growth phase, ben sopra quella dell'economia, non sostenibile. Mature: tasso stabile di lungo periodo della fase matura, usato nel Gordon e nei terminal value."
  }, {
    los: '23j',
    q: 'Le assunzioni del two-stage DDM (prima versione)?',
    a: "Crescita costante g_S per n anni, poi salto immediato e permanente al tasso maturo g_L. Adatto quando la transizione è brusca (es. scadenza brevetto)."
  }, {
    los: '23j',
    q: "Quando è preferibile l'H-model al two-stage classico?",
    a: "Quando la crescita declina gradualmente e linearmente da g_S a g_L, anziché con un salto a gradino: più realistico per molte aziende in transizione."
  }, {
    los: '23k',
    q: 'Terminal value con un multiplo: come si fa?',
    a: "TV_n = multiplo (es. P/E giustificato o di settore) × fondamentale previsto alla data terminale (es. EPS_n). Alternativa al Gordon sul primo dividendo maturo."
  }, {
    los: '23n',
    q: "Come si interpreta l'IRR di un DDM?",
    a: "Dato il prezzo di mercato e gli altri input, l'IRR è il rendimento atteso implicito nel prezzo: usabile come stima del required return."
  }],
  quiz: [{
    q: "Quale NON è un tipo di flusso di cassa usato nel DCF?",
    opts: ['Dividendi', 'Residual income', 'Book value'],
    correct: 2,
    exp: "Il book value è un input del residual income model, non un flusso di cassa."
  }, {
    q: "Da prospettiva di azionista di minoranza, il modello più appropriato è:",
    opts: ['FCFE', 'FCFF', 'DDM'],
    correct: 2,
    exp: "Il DDM assume la prospettiva di chi non controlla la politica dei dividendi. FCFE/FCFF sono adatti alla prospettiva di controllo."
  }, {
    q: "Dividendo atteso $1,50, prezzo di vendita $38, r = 9%. Valore (1 anno):",
    opts: ['$36,24', '$39,50', '$34,00'],
    correct: 0,
    exp: "V₀ = (1,50 + 38)/1,09 = $36,24."
  }, {
    q: "D₀ = $5, g = 4%, r = 8%. Gordon value:",
    opts: ['$104', '$130', '$125'],
    correct: 1,
    exp: "V₀ = D₀(1+g)/(r−g) = 5(1,04)/(0,08−0,04) = 5,20/0,04 = $130."
  }, {
    q: "Privilegiata par $100, tasso fisso 6%, r = 8%. Valore:",
    opts: ['$55', '$70', '$75'],
    correct: 2,
    exp: "V₀ = D_p/r_p = 6/0,08 = $75."
  }, {
    q: "EPS atteso $1,50, r = 12%, prezzo $36. PVGO:",
    opts: ['$12,0', '$23,5', '$36,0'],
    correct: 1,
    exp: "36 = 1,50/0,12 + PVGO = 12,5 + PVGO → PVGO = $23,5."
  }, {
    q: "In quale fase il Gordon model da solo è più appropriato?",
    opts: ['Growth phase', 'Transition phase', 'Mature phase'],
    correct: 2,
    exp: "Nella fase matura: crescita stabilizzata e sostenibile, ROE vicino a r."
  }, {
    q: "Nella growth phase, i free cash flow sono tipicamente:",
    opts: ['Negativi', 'Positivi e crescenti', 'Pari ai dividendi'],
    correct: 0,
    exp: "Negativi: l'azienda investe pesantemente nell'espansione; il payout è basso o nullo."
  }, {
    q: "Trailing P/E giustificato con payout 32%, r = 13%, g = 8%:",
    opts: ['8,00', '3,50', '6,91'],
    correct: 2,
    exp: "(0,32 × 1,08)/(0,13 − 0,08) = 0,3456/0,05 = 6,91."
  }, {
    q: "Nell'H-model, H rappresenta:",
    opts: ['Il periodo totale di alta crescita', 'La metà del periodo di alta crescita', 'Il tasso di crescita massimo'],
    correct: 1,
    exp: "H = metà della durata (in anni) del periodo in cui la crescita declina linearmente da g_S a g_L."
  }, {
    q: "ROE = 12%, payout = 40%. Sustainable growth rate:",
    opts: ['4,8%', '7,2%', '12,0%'],
    correct: 1,
    exp: "b = 1 − 0,40 = 0,60; g = 0,60 × 12% = 7,2%."
  }, {
    q: "Nel modello PRAT, la T rappresenta:",
    opts: ['Il tax rate', 'La leva finanziaria (Assets/Equity)', "L'asset turnover"],
    correct: 1,
    exp: "P = retention (profit retention), R = margine, A = asset turnover, T = leva finanziaria (Assets/Equity)."
  }]
}, /* ================================================================== R24 */
{
  n: 24,
  key: 'r24',
  title: 'Free Cash Flow Valuation',
  sub: 'FCFF, FCFE, derivazioni da NI/CFO/EBIT/EBITDA, multistadio',
  weight: '11–14%',
  theory: [{
    code: '24(a-b)',
    title: 'FCFF vs FCFE e quando usarli',
    imp: 'ALTA',
    blocks: [{
      h: 'FCFF',
      p: "Flusso di cassa dalle operazioni disponibile a tutti i finanziatori (debito + equity), dopo gli investimenti necessari. Si sconta al WACC → valore dell'azienda."
    }, {
      h: 'FCFE',
      p: "Flusso di cassa dopo i pagamenti netti ai detentori di debito: misura post-debito, prospettiva proprietaria. Si sconta a r → valore dell'equity."
    }, {
      h: 'Quando preferire il FCF al DDM',
      list: ["L'azienda non paga dividendi (o minimi).", 'I dividendi divergono dalla capacità di pagarli (sono a discrezione del board).', "Si valuta un takeover target / prospettiva di controllo: il FCFE è il flusso disponibile senza compromettere le operazioni."]
    }]
  }, {
    code: '24(c)',
    title: 'Calcolo del FCFF',
    imp: 'ALTA',
    blocks: [{
      f: 'FCFF = NI + NCC + Int(1-t) - FCInv - WCInv',
      cap: 'Da utile netto. NCC = oneri non monetari (ammortamenti, ecc.). Int(1−t) riaggiunto perché flusso a favore dei creditori. I dividendi privilegiati, se dedotti nel NI, vanno riaggiunti.'
    }, {
      f: 'FCFF = CFO + Int(1-t) - FCInv',
      cap: 'Da flusso di cassa operativo.'
    }, {
      f: 'FCFF = EBIT(1-t) + Dep - FCInv - WCInv',
      cap: 'Da EBIT.'
    }, {
      f: 'FCFF = EBITDA(1-t) + Dep\\cdot t - FCInv - WCInv',
      cap: 'Da EBITDA: si riaggiunge solo lo scudo fiscale dell\u2019ammortamento.'
    }]
  }, {
    code: '24(c)',
    title: 'Calcolo del FCFE',
    imp: 'ALTA',
    blocks: [{
      f: 'FCFE = FCFF - Int(1-t) + \\text{Net Borrowing}',
      cap: 'Dal FCFF: si rimuove l\u2019interesse netto ai creditori e si aggiunge l\u2019indebitamento netto (nuovo debito − rimborsi).'
    }, {
      f: 'FCFE = NI + NCC - FCInv - WCInv + \\text{Net Borrowing}',
      cap: 'Da utile netto: l\u2019after-tax interest è già dedotto nel NI.'
    }, {
      f: 'FCFE = CFO - FCInv + \\text{Net Borrowing}',
      cap: 'Da flusso di cassa operativo.'
    }]
  }, {
    code: '24(g)',
    title: 'Effetti di dividendi, riacquisti, leva',
    imp: 'ALTA',
    blocks: [{
      p: "Dividendi, riacquisti ed emissioni di azioni NON influenzano FCFF e FCFE: sono usi dei flussi di cassa, non flussi disponibili. Le variazioni di leva hanno effetto modesto sul FCFE: il nuovo debito aumenta il FCFE nell'anno di emissione e lo riduce negli anni successivi (interessi al netto delle imposte e rimborsi); non toccano il FCFF."
    }]
  }, {
    code: '24(h)',
    title: 'NI ed EBITDA come proxy',
    imp: 'MEDIA',
    blocks: [{
      p: "Utile netto ed EBITDA sono proxy imperfetti: il NI contiene oneri non monetari e ignora gli investimenti; l'EBITDA ignora capex, variazioni di capitale circolante e imposte, e sovrastima il flusso operativo quando il circolante cresce. Il FCFF ha il legame teorico più forte con la valutazione."
    }]
  }, {
    code: '24(i)',
    title: 'Modelli single & multistadio',
    imp: 'ALTA',
    blocks: [{
      f: '\\text{Firm value} = \\dfrac{FCFF_1}{WACC - g} = \\dfrac{FCFF_0(1+g)}{WACC - g}',
      cap: 'Single-stage FCFF (crescita costante).'
    }, {
      f: '\\text{Equity value} = \\dfrac{FCFE_1}{r - g}',
      cap: 'Single-stage FCFE.'
    }, {
      f: '\\text{Firm} = \\sum_{t=1}^{n}\\dfrac{FCFF_t}{(1+WACC)^t} + \\dfrac{FCFF_{n+1}}{WACC-g}\\cdot\\dfrac{1}{(1+WACC)^n}',
      cap: 'Two-stage FCFF. Equity = Firm − valore di mercato del debito.'
    }, {
      p: "Sensitivity analysis: i valori stimati sono molto sensibili a g e al tasso di sconto; piccole variazioni degli input producono ampie variazioni del valore."
    }]
  }],
  cards: [{
    los: '24a',
    q: 'FCFF vs FCFE: a quale tasso si scontano e cosa danno?',
    a: "FCFF al WACC → valore dell'azienda (flusso disponibile a tutti i finanziatori). FCFE a r → valore dell'equity (post-debito, prospettiva proprietaria)."
  }, {
    los: '24a',
    q: 'Tre ragioni per preferire il FCF al DDM?',
    a: "1) Dividendi nulli o minimi; 2) i dividendi sono a discrezione del board e divergono dalla capacità di pagarli; 3) prospettiva di controllo/takeover."
  }, {
    los: '24c',
    q: "FCFF dall'utile netto?",
    a: "FCFF = NI + NCC + Int(1−t) − FCInv − WCInv. L'interesse netto si riaggiunge perché flusso a favore dei creditori."
  }, {
    los: '24c',
    q: 'FCFF dal CFO?',
    a: "FCFF = CFO + Int(1−t) − FCInv."
  }, {
    los: '24c',
    q: 'FCFF da EBIT e da EBITDA?',
    a: "Da EBIT: EBIT(1−t) + Dep − FCInv − WCInv. Da EBITDA: EBITDA(1−t) + Dep·t − FCInv − WCInv (si recupera solo lo scudo fiscale dell'ammortamento)."
  }, {
    los: '24c',
    q: 'FCFE dal FCFF?',
    a: "FCFE = FCFF − Int(1−t) + Net Borrowing."
  }, {
    los: '24c',
    q: "FCFE dall'utile netto?",
    a: "FCFE = NI + NCC − FCInv − WCInv + Net Borrowing. L'after-tax interest non si riaggiunge: è già dedotto nel NI."
  }, {
    los: '24c',
    q: 'Come si trattano i dividendi privilegiati nel FCFF da NI?',
    a: "Se dedotti per arrivare al NI (disponibile agli azionisti ordinari), vanno riaggiunti, come l'interesse: sono flussi verso una classe di finanziatori."
  }, {
    los: '24d',
    q: 'Calcola il FCFF: NI 200, Dep 50, Int 40, t 25%, FCInv 120, WCInv 30.',
    a: "FCFF = NI + NCC + Int(1−t) − FCInv − WCInv = 200 + 50 + 30 − 120 − 30 = 130."
  }, {
    los: '24f',
    q: 'Perché il FCFE è spesso preferito al DDM?',
    a: "I dividendi sono a discrezione del board e possono non segnalare la redditività di lungo periodo; molte società non li pagano; il FCFE misura il distribuibile senza compromettere le operazioni — la misura giusta per un takeover target."
  }, {
    los: '24g',
    q: 'I riacquisti di azioni influenzano il FCFE?',
    a: "No. Dividendi, riacquisti ed emissioni sono usi del free cash flow, non lo determinano."
  }, {
    los: '24g',
    q: "Effetto dell'emissione di nuovo debito sul FCFE?",
    a: "Aumenta il FCFE nell'anno di emissione (net borrowing positivo) e lo riduce negli anni successivi (interessi netti e rimborsi). Il FCFF non è toccato."
  }, {
    los: '24h',
    q: "Perché l'EBITDA è un proxy debole del flusso di cassa?",
    a: "Ignora capex, variazioni di capitale circolante e imposte; sovrastima il flusso operativo quando il circolante cresce."
  }, {
    los: '24i',
    q: "Valore dell'azienda single-stage FCFF?",
    a: "Firm value = FCFF₁/(WACC − g) = FCFF₀(1+g)/(WACC − g)."
  }, {
    los: '24i',
    q: "Come si ottiene l'equity value da un modello FCFF?",
    a: "Equity = Firm value − valore di mercato del debito. Poi VPS = Equity/numero di azioni."
  }, {
    los: '24i',
    q: 'A cosa serve la sensitivity analysis nei modelli FCF?',
    a: "I valori sono molto sensibili a g e al tasso di sconto: si testano variazioni degli input per capire l'intervallo del valore stimato."
  }, {
    los: '24a',
    q: 'Quando il FCF model è poco affidabile?',
    a: "Quando i FCF attesi sono fortemente negativi (capex elevate) per l'orizzonte di previsione: meglio il residual income."
  }, {
    los: '24b',
    q: 'Quale prospettiva proprietaria implica l\u2019approccio FCFE?',
    a: "Quella di un acquirente che può cambiare la politica dei dividendi (controllo). Il DDM invece assume chi non controlla la dividend policy: il valore può non realizzarsi finché i dividendi non riflettono la redditività di lungo periodo."
  }, {
    los: '24e',
    q: 'I due approcci per prevedere FCFF e FCFE?',
    a: "1) Applicare un tasso di crescita costante al FCF corrente (se la crescita storica è costante e attesa continuare); 2) prevedere le componenti: EBIT(1−t), oneri non monetari netti, FCInv e WCInv — più complesso."
  }, {
    los: '24e',
    q: 'Ipotesi centrale del sales-based forecasting?',
    a: "Gli investimenti in capitale fisso e circolante sono legati alle vendite: si prevedono dalla relazione storica tra incrementi delle vendite e FCInv/WCInv; l'EBIT da vendite previste × margine EBIT."
  }, {
    los: '24k',
    q: 'Perché la sensitivity analysis è essenziale nei modelli FCF?',
    a: "I valori stimati sono molto sensibili al tasso di crescita e al tasso di sconto: piccole variazioni degli input producono ampie variazioni del valore stimato."
  }, {
    los: '24l',
    q: 'I due approcci per il terminal value in un modello FCF multistadio?',
    a: "1) Perpetuità in crescita: TV_n = FCFF_{n+1}/(WACC−g) (o FCFE_{n+1}/(r−g)); 2) multipli: TV_n = trailing P/E giustificato × EPS anno n, oppure leading P/E × EPS anno n+1."
  }, {
    los: '24c',
    q: 'Cosa sono gli NCC e perché si rettificano?',
    a: "Oneri (e proventi) non monetari come ammortamenti e svalutazioni: riducono il NI senza uscita di cassa, quindi si riaggiungono per passare dal reddito al flusso di cassa."
  }, {
    los: '24d',
    q: 'Calcola il FCFE: FCFF 130, Int 40, t 25%, net borrowing 20.',
    a: "FCFE = FCFF − Int(1−t) + NB = 130 − 30 + 20 = 120."
  }, {
    los: '24e',
    q: "Come si prevede l'EBIT nel metodo per componenti?",
    a: "EBIT = vendite previste × margine EBIT, stimati dai dati storici e dall'ambiente economico corrente e atteso."
  }, {
    los: '24g',
    q: 'Perché le variazioni di leva non toccano il FCFF?',
    a: "Il FCFF è pre-debito: misura il flusso disponibile a tutti i finanziatori, prima di interessi e rimborsi. La leva sposta solo la ripartizione tra creditori e azionisti (cioè il FCFE)."
  }, {
    los: '24i',
    q: "Com'è strutturato un three-stage FCF model?",
    a: "Tre stadi di crescita distinti (alta, transizione, matura), oppure due stadi con il secondo in declino lineare verso il tasso maturo, più il terminal value."
  }, {
    los: '24i',
    q: 'Dal firm value al valore per azione?',
    a: "VPS = (Firm value − valore di mercato del debito) / numero di azioni in circolazione."
  }, {
    los: '24l',
    q: 'TV con multiplo: EPS anno 5 = $5, trailing P/E mediano 28. TV?',
    a: "TV₅ = 28 × 5,00 = $140."
  }, {
    los: '24i',
    q: 'Come si trattano le attività non operative nella valutazione?',
    a: "Si valutano separatamente e si sommano: Firm value = valore delle attività operative + valore delle non operative (liquidità in eccesso, titoli negoziabili)."
  }],
  quiz: [{
    q: "A quale tasso si sconta il FCFF per il valore dell'azienda?",
    opts: ['WACC', 'Cost of equity (r)', 'r − g'],
    correct: 0,
    exp: "Il FCFF è disponibile a tutti i finanziatori → WACC. Il FCFE si sconta a r."
  }, {
    q: "Nel passaggio da NI a FCFF, Int(1−t) si:",
    opts: ['Sottrae', 'Riaggiunge', 'Ignora'],
    correct: 1,
    exp: "Si riaggiunge: dedotto per arrivare al NI, ma è un flusso disponibile ai creditori."
  }, {
    q: "FCFE = FCFF − Int(1−t) + ?",
    opts: ['FCInv', 'Net Borrowing', 'WCInv'],
    correct: 1,
    exp: "Si aggiunge il net borrowing (nuovo debito − rimborsi), disponibile agli azionisti."
  }, {
    q: "Da EBITDA: FCFF = EBITDA(1−t) + ?",
    opts: ['Dep(1−t)', 'Dep·t', 'Int(1−t)'],
    correct: 1,
    exp: "Si riaggiunge solo lo scudo fiscale dell'ammortamento: Dep × t."
  }, {
    q: "Un riacquisto di azioni proprie influenza:",
    opts: ['Il FCFF', 'Il FCFE', 'Né FCFF né FCFE'],
    correct: 2,
    exp: "Dividendi, riacquisti ed emissioni sono usi dei flussi, non li determinano."
  }, {
    q: "L'emissione di nuovo debito nell'anno corrente:",
    opts: ['Aumenta il FCFE', 'Riduce il FCFE', 'Aumenta il FCFF'],
    correct: 0,
    exp: "Il net borrowing positivo aumenta il FCFE nell'anno di emissione; il FCFF non è toccato."
  }, {
    q: "FCFF₀ = 100, g = 5%, WACC = 10%. Valore dell'azienda:",
    opts: ['$2.000', '$2.100', '$1.050'],
    correct: 1,
    exp: "FCFF₁ = 105; 105/(0,10 − 0,05) = $2.100."
  }, {
    q: "Da prospettiva di maggioranza (controllo), il modello più appropriato è:",
    opts: ['DDM', 'FCFE/FCFF', 'Gordon su dividendi'],
    correct: 1,
    exp: "Chi controlla può cambiare la politica dei dividendi: il free cash flow è la misura rilevante. Il DDM è da minoranza."
  }, {
    q: "Il FCFE è una misura di flusso di cassa:",
    opts: ['Pre-debito', 'Post-debito', 'Pre-imposte'],
    correct: 1,
    exp: "Post-debito: dopo interessi netti e pagamenti netti ai creditori."
  }, {
    q: "Il FCF model è meno appropriato quando:",
    opts: ['I FCF attesi sono fortemente negativi per capex elevate', "L'azienda non paga dividendi", 'Si assume prospettiva di controllo'],
    correct: 0,
    exp: "FCF negativi attesi rendono il modello poco affidabile: meglio il residual income."
  }, {
    q: "Equity value da un two-stage FCFF model:",
    opts: ['Firm value + debito', 'Firm value − valore di mercato del debito', 'PV dei dividendi'],
    correct: 1,
    exp: "Equity = Firm − MV del debito; poi si divide per il numero di azioni."
  }]
}, /* ================================================================== R25 */
{
  n: 25,
  key: 'r25',
  title: 'Market-Based Valuation: Multiples',
  sub: 'P/E, EPS normalizzato, P/B, P/S, PEG, EV/EBITDA',
  weight: '11–14%',
  theory: [{
    code: '25(a-b)',
    title: 'Comparabili vs fondamentali · justified multiple',
    imp: 'ALTA',
    blocks: [{
      p: "Due approcci: method of comparables (relativo a peer, assume che asset simili abbiano valori simili) e metodo basato sui fondamentali previsti. Un justified price multiple è il valore equo del multiplo dati i fondamentali."
    }, {
      list: ['Justified > multiplo corrente → azione sottovalutata.', 'Justified < multiplo corrente → azione sopravvalutata.']
    }]
  }, {
    code: '25(c-d)',
    title: 'P/E: razionale e problemi',
    imp: 'MEDIA',
    blocks: [{
      h: 'Razionale',
      p: "L'earning power è il driver primario del valore; il P/E è il multiplo più usato e riconosciuto."
    }, {
      h: 'Problemi',
      p: "EPS negativi rendono il P/E privo di significato; EPS volatili o distorti da scelte contabili riducono la comparabilità. Trailing P/E usa gli EPS degli ultimi 4 trimestri; leading P/E gli EPS attesi."
    }]
  }, {
    code: '25(e)',
    title: 'EPS normalizzato',
    imp: 'ALTA',
    blocks: [{
      p: "Per la ciclicità, gli ultimi 4 trimestri possono non riflettere il potere di utile sostenibile. Due metodi di normalizzazione:"
    }, {
      list: ["Historical average EPS: media dell'EPS sull'ultimo ciclo economico completo (ignora però la crescita dimensionale).", "Average ROE: EPS normalizzato = ROE medio × book value per share corrente — riflette la dimensione attuale, perciò è preferito."]
    }, {
      f: 'EPS_{norm} = \\overline{ROE} \\times BVPS_0',
      cap: 'Es.: ROE medio 16,75% × BVPS $28,00 = $4,69.'
    }]
  }, {
    code: '25(f)',
    title: 'Earnings yield (E/P)',
    imp: 'MEDIA',
    blocks: [{
      f: 'E/P = \\dfrac{EPS}{P_0}',
      cap: 'Reciproco del P/E.'
    }, {
      p: "Con EPS negativi il P/E non è significativo, mentre l'earnings yield può comunque essere calcolato e usato per ordinare (rank) i titoli: E/P più alto = più conveniente."
    }]
  }, {
    code: '25(g-h)',
    title: 'Multipli giustificati sui fondamentali',
    imp: 'ALTA',
    blocks: [{
      f: '\\dfrac{P_0}{E_1} = \\dfrac{1-b}{r-g}',
      cap: 'P/E leading giustificato (trailing = leading × (1+g)).'
    }, {
      f: '\\dfrac{P_0}{B_0} = \\dfrac{ROE - g}{r - g}',
      cap: 'P/B giustificato: cresce con lo spread (ROE − r).'
    }, {
      f: '\\dfrac{P_0}{S_0} = \\dfrac{(E_0/S_0)(1-b)(1+g)}{r-g}',
      cap: 'P/S giustificato. E₀/S₀ = margine di profitto netto.'
    }]
  }, {
    code: '25(k)',
    title: 'Rapporto PEG',
    imp: 'MEDIA',
    blocks: [{
      f: 'PEG = \\dfrac{P/E}{g}',
      cap: 'P/E per unità di crescita attesa: più basso = più attraente; PEG < 1 spesso letto come sottovalutazione.'
    }, {
      p: "Limiti: assume relazione lineare tra P/E e crescita, ignora le differenze di rischio e la durata della crescita."
    }]
  }, {
    code: '25(n)',
    title: 'EV multiples & EV/EBITDA',
    imp: 'ALTA',
    blocks: [{
      f: 'EV = MV_{equity} + MV_{preferred} + MV_{debt} - \\text{Cash & ST inv.}',
      cap: 'Enterprise value: il costo di acquisto dell\u2019intera azienda, al netto della liquidità.'
    }, {
      list: ["EV/EBITDA è preferito al P/E per confrontare aziende con leva diversa.", "L'EBITDA è spesso positivo anche con EPS negativo.", "Limite: l'EBITDA sovrastima il flusso operativo se il circolante cresce; il FCFF ha legame teorico più forte."]
    }]
  }, {
    code: '25(q)',
    title: 'Tendenza centrale dei multipli',
    imp: 'MEDIA',
    blocks: [{
      p: "Per i multipli di un gruppo di peer, la media armonica (o armonica ponderata) e la mediana riducono la distorsione degli outlier rispetto alla media aritmetica, che sovrappesa i multipli alti."
    }, {
      f: 'X_H = \\dfrac{n}{\\sum_{i=1}^{n} \\frac{1}{X_i}}',
      cap: 'Media armonica semplice di n multipli.'
    }]
  }],
  cards: [{
    los: '25a',
    q: 'Su cosa si basa il method of comparables?',
    a: "Sull'assunzione che asset simili abbiano valori simili: si confronta il multiplo del titolo con quello di un peer/benchmark assunto correttamente prezzato."
  }, {
    los: '25b',
    q: 'Justified > o < multiplo corrente: cosa significa?',
    a: "Justified > corrente → azione sottovalutata. Justified < corrente → sopravvalutata."
  }, {
    los: '25c',
    q: 'Trailing vs leading P/E?',
    a: "Trailing: prezzo / EPS degli ultimi 4 trimestri. Leading (forward): prezzo / EPS attesi dei prossimi 4 trimestri o dell'anno fiscale successivo."
  }, {
    los: '25e',
    q: 'I due metodi di normalizzazione dell\u2019EPS?',
    a: "1) Historical average EPS (media sull'ultimo ciclo completo); 2) average ROE × BVPS corrente — preferito perché riflette la dimensione attuale dell'azienda."
  }, {
    los: '25e',
    q: 'EPS normalizzato con ROE medio 16,75% e BVPS $28?',
    a: "EPS_norm = 0,1675 × 28,00 = $4,69."
  }, {
    los: '25f',
    q: 'Perché usare l\u2019earnings yield invece del P/E?',
    a: "Con EPS negativi il P/E non è significativo, mentre l'E/P resta calcolabile e utilizzabile per ordinare i titoli (E/P alto = più conveniente)."
  }, {
    los: '25h',
    q: 'P/B giustificato sui fondamentali?',
    a: "P₀/B₀ = (ROE − g)/(r − g). Più ampio lo spread (ROE − r), più alto il P/B giustificato."
  }, {
    los: '25h',
    q: 'P/S giustificato?',
    a: "P₀/S₀ = (E₀/S₀)(1−b)(1+g)/(r−g), con E₀/S₀ = margine di profitto netto."
  }, {
    los: '25g',
    q: 'Razionale e limiti del P/B?',
    a: "Razionale: il book value è positivo anche con utili negativi, più stabile dell'EPS; adatto a banche/assicurazioni e liquidazioni. Limiti: ignora gli intangibili non contabilizzati, distorto da scelte contabili."
  }, {
    los: '25k',
    q: 'Come si calcola e interpreta il PEG?',
    a: "PEG = (P/E)/g. Più basso è più attraente; PEG < 1 spesso indica sottovalutazione. Assume linearità e ignora rischio e durata della crescita."
  }, {
    los: '25n',
    q: "Formula dell'enterprise value?",
    a: "EV = MV equity + MV preferred + MV debito − cassa e investimenti a breve."
  }, {
    los: '25n',
    q: 'Perché EV/EBITDA è migliore del P/E con leva diversa?',
    a: "Confronta l'intera azienda (capital-structure neutral) e l'EBITDA è spesso positivo anche con EPS negativo."
  }, {
    los: '25q',
    q: 'Quale tendenza centrale per i multipli dei peer?',
    a: "Media armonica (o armonica ponderata) e mediana: riducono la distorsione degli outlier rispetto alla media aritmetica, che sovrappesa i multipli alti."
  }, {
    los: '25q',
    q: 'Media armonica di P/E 10 e 30?',
    a: "X_H = 2/(1/10 + 1/30) = 2/(0,1333) = 15,0 — più bassa della media aritmetica (20), meno influenzata dal multiplo alto."
  }, {
    los: '25d',
    q: 'Come si calcolano dividend yield e P/CF, e come si interpretano?',
    a: "Dividend yield = D/P (trailing: dividendi degli ultimi 4 trimestri; leading: dividendi attesi). P/CF = prezzo/cash flow per share: tra comparabili, il P/CF più basso è relativamente sottovalutato."
  }, {
    los: '25i',
    q: "Cos'è il P/E predetto da regressione cross-sectional?",
    a: "Un P/E stimato regredendo i P/E di un gruppo di titoli sui fondamentali (es. payout, beta, crescita degli utili): Predicted P/E = a + b·DPR + c·Beta + d·EGR. Limite: vale per quel campione e quel periodo."
  }, {
    los: '25j',
    q: 'Come si valuta un titolo con il method of comparables?',
    a: "Si confronta il suo multiplo col multiplo benchmark dei peer: più basso → relativamente sottovalutato. Occorre però controllare le differenze nei fondamentali (crescita, rischio) che giustificano multipli diversi."
  }, {
    los: '25l',
    q: 'Multipli per il terminal value: vantaggio e svantaggio vs Gordon?',
    a: "Vantaggio: ancorato ai dati di mercato (il Gordon dipende da molte stime sensibili). Svantaggio: se il benchmark è mal prezzato, l'errore si trasferisce al terminal value."
  }, {
    los: '25m',
    q: 'Definizioni alternative di cash flow per i multipli e il proxy migliore?',
    a: "EPS + non-cash charges (ignora ricavi non monetari e circolante), CFO (richiede rettifiche per voci non ricorrenti), FCFE (il proxy più valido ma il più volatile), EBITDA (meglio per EV, è un flusso pre-interessi)."
  }, {
    los: '25o',
    q: 'Perché i confronti cross-border sono difficili?',
    a: "Differenze nei metodi contabili, economiche e culturali, quindi in crescita e rischio: i P/E dello stesso settore variano ampiamente tra paesi nonostante la convergenza degli standard."
  }, {
    los: '25p',
    q: 'I tre indicatori momentum?',
    a: "Earnings surprise (UE_t = EPS riportato − atteso), standardized unexpected earnings (SUE = UE scalato per la sua deviazione standard) e relative strength (performance del titolo vs benchmark o vs proprio passato)."
  }, {
    los: '25r',
    q: 'Giudizio finale con i multipli?',
    a: "Multiplo corrente < justified (o < benchmark a parità di fondamentali) → sottovalutata; > → sopravvalutata; ≈ → equamente valutata."
  }, {
    los: '25c',
    q: 'Razionale e svantaggio del P/S?',
    a: "Razionale: i ricavi sono meno manipolabili dell'EPS e positivi anche in perdita; più stabili. Svantaggio: non cattura redditività e struttura dei costi — vendite alte non implicano utili."
  }, {
    los: '25c',
    q: 'Razionale del P/CF e del dividend yield?',
    a: "P/CF: il cash flow è meno manipolabile dell'EPS e il multiplo è più stabile. Dividend yield: componente certa del total return; svantaggio: ignora il capital gain atteso."
  }, {
    los: '25d',
    q: 'Trailing vs leading dividend yield?',
    a: "Trailing: dividendi degli ultimi 4 trimestri / prezzo. Leading: dividendi attesi nei prossimi 12 mesi / prezzo."
  }, {
    los: '25e',
    q: "Cosa sono gli underlying earnings?",
    a: "Utili depurati dalle voci non ricorrenti (gain/loss una tantum, ristrutturazioni): riflettono il potere di utile persistente — base migliore per il P/E."
  }, {
    los: '25g',
    q: 'Come crescita e rischio muovono i multipli giustificati?',
    a: "Relazione positiva con la crescita attesa g (a parità di resto) e negativa con il rischio: un r più alto abbassa P/E, P/B e P/S giustificati."
  }, {
    los: '25i',
    q: 'Due limiti del P/E predetto da regressione?',
    a: "Vale solo per il campione e il periodo della stima (non generalizzabile nel tempo), e i fondamentali regressori sono spesso correlati tra loro (multicollinearità)."
  }, {
    los: '25m',
    q: "Perché l'EBITDA è più adatto a multipli EV che a multipli di prezzo?",
    a: "È un flusso pre-interessi che spetta a tutta l'impresa (debito + equity): coerente col numeratore EV, non col solo prezzo dell'equity."
  }, {
    los: '25b',
    q: 'Come si usa un justified multiple per stimare il valore?',
    a: "Valore = multiplo giustificato × fondamentale previsto (es. justified P/E × EPS atteso), da confrontare poi col prezzo di mercato."
  }],
  quiz: [{
    q: "Se il justified P/E è superiore al P/E corrente, l'azione è:",
    opts: ['Sopravvalutata', 'Sottovalutata', 'Equamente valutata'],
    correct: 1,
    exp: "Justified > corrente → il mercato paga meno del giustificato → sottovalutata."
  }, {
    q: "Il metodo di normalizzazione EPS preferito è:",
    opts: ['Historical average EPS', 'Average ROE × BVPS corrente', 'Ultimo EPS riportato'],
    correct: 1,
    exp: "Il metodo del ROE medio riflette la dimensione attuale dell'azienda (via BVPS corrente), a differenza della media storica."
  }, {
    q: "ROE medio 16,75%, BVPS $28. EPS normalizzato:",
    opts: ['$4,39', '$4,69', '$5,02'],
    correct: 1,
    exp: "0,1675 × 28,00 = $4,69."
  }, {
    q: "Con EPS negativi, per ordinare i titoli si usa:",
    opts: ['Il P/E trailing', "L'earnings yield (E/P)", 'Il PEG'],
    correct: 1,
    exp: "L'E/P resta calcolabile e ordinabile anche con utili negativi; il P/E perde significato."
  }, {
    q: "Il P/B giustificato è:",
    opts: ['(ROE − g)/(r − g)', '(1 − b)/(r − g)', '(P/E)/g'],
    correct: 0,
    exp: "P₀/B₀ = (ROE − g)/(r − g)."
  }, {
    q: "ROE = 16%, r = 12%, g = 10%. P/B giustificato:",
    opts: ['1,5', '3,0', '4,0'],
    correct: 1,
    exp: "(0,16 − 0,10)/(0,12 − 0,10) = 0,06/0,02 = 3,0."
  }, {
    q: "Nel P/S giustificato, E₀/S₀ rappresenta:",
    opts: ['Il payout', 'Il margine di profitto netto', "L'asset turnover"],
    correct: 1,
    exp: "E₀/S₀ = utile/vendite = margine di profitto netto."
  }, {
    q: "Forward P/E 9,21, crescita EPS 12%. PEG:",
    opts: ['0,77', '1,10', '1,32'],
    correct: 0,
    exp: "9,21/12 = 0,77 (< 1, relativamente attraente)."
  }, {
    q: "L'enterprise value si calcola sottraendo:",
    opts: ['Il debito', 'La cassa e gli investimenti a breve', 'Le preferred'],
    correct: 1,
    exp: "EV = MV equity + preferred + debito − cassa e investimenti a breve."
  }, {
    q: "Per confrontare aziende con leva molto diversa è preferibile:",
    opts: ['P/E', 'EV/EBITDA', 'P/E leading'],
    correct: 1,
    exp: "EV/EBITDA è neutrale rispetto alla struttura del capitale."
  }, {
    q: "P/E dei peer: 10, 12, 50. La misura meno distorta dall'outlier è:",
    opts: ['Media aritmetica', 'Media armonica o mediana', 'Il massimo'],
    correct: 1,
    exp: "Armonica e mediana riducono l'effetto degli outlier; l'aritmetica (24) sovrappesa il 50."
  }]
}, /* ================================================================== R26 */
{
  n: 26,
  key: 'r26',
  title: 'Residual Income Valuation',
  sub: 'RI, EVA/MVA, single-stage, persistence factor, clean surplus',
  weight: '11–14%',
  theory: [{
    code: '26(a)',
    title: 'Residual income, EVA, MVA',
    imp: 'ALTA',
    blocks: [{
      f: 'RI = NI - r \\times \\text{Equity}',
      cap: 'Utile in eccesso rispetto all\u2019equity charge (costo in dollari del capitale azionario).'
    }, {
      f: 'EVA = NOPAT - (C\\% \\times TC), \\quad NOPAT = EBIT(1-t)',
      cap: 'Economic value added. C% = WACC; TC = capitale totale investito.'
    }, {
      f: 'MVA = \\text{Market value} - \\text{Book value of total capital}',
      cap: 'Market value added: il valore creato dal management.'
    }]
  }, {
    code: '26(c)',
    title: 'Valore intrinseco con il RI model',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = B_0 + \\sum_{t=1}^{\\infty}\\dfrac{RI_t}{(1+r)^t}',
      cap: 'Valore = book value corrente + PV dei residual income futuri.'
    }, {
      f: 'RI_t = E_t - r\\,B_{t-1} = (ROE - r)\\,B_{t-1}',
      cap: 'Residual income per azione. B = book value dell\u2019equity per share.'
    }]
  }, {
    code: '26(f)',
    title: 'Single-stage & justified P/B',
    imp: 'ALTA',
    blocks: [{
      f: 'V_0 = B_0 + \\dfrac{ROE - r}{r - g}\\,B_0',
      cap: 'Single-stage residual income: book value + premio legato allo spread.'
    }, {
      f: '\\dfrac{P_0}{B_0} = 1 + \\dfrac{ROE - r}{r - g} = \\dfrac{ROE - g}{r - g}',
      cap: 'Justified P/B. ROE > r → P/B > 1; ROE < r → P/B < 1.'
    }]
  }, {
    code: '26(d)',
    title: 'Determinanti e mean reversion',
    imp: 'MEDIA',
    blocks: [{
      p: "Il residual income è guidato dallo spread (ROE − r): ROE persistentemente sopra il costo dell'equity genera RI positivi e premio sul book value. La concorrenza tende a erodere lo spread nel tempo (mean reversion)."
    }]
  }, {
    code: '26(h)',
    title: 'Continuing RI & persistence factor',
    imp: 'ALTA',
    blocks: [{
      p: "Oltre l'orizzonte esplicito, il continuing residual income dipende dalla persistenza dello spread. ω è il persistence factor: ω = 1 → il RI resta costante indefinitamente; ω = 0 → nessun RI dopo l'orizzonte. Maggiore ω, maggiore il valore del flusso terminale. Ipotesi alternative: RI decade verso il livello medio di settore, o il premio sul book value svanisce subito."
    }]
  }, {
    code: '26(g)',
    title: 'Clean surplus relation & rettifiche',
    imp: 'MEDIA',
    blocks: [{
      f: 'B_t = B_{t-1} + E_t - D_t',
      cap: 'Clean surplus: il book value cresce di utili meno dividendi.'
    }, {
      p: "Il RI model assume la clean surplus relation: viene violata quando poste vanno direttamente a OCI bypassando il conto economico (es. FX translation, titoli AFS). L'analista deve rettificare, insieme a R&S, operating lease, e altre poste contabili."
    }]
  }, {
    code: '26(i-j)',
    title: 'Forza, debolezza e quando usarlo',
    imp: 'MEDIA',
    blocks: [{
      h: 'Forza',
      list: ['Il terminal value pesa meno: gran parte del valore è nel book value corrente.', 'Usa dati contabili disponibili.', 'Applicabile senza dividendi o con FCF negativi.']
    }, {
      h: 'Debolezza',
      list: ['Dipende da dati contabili manipolabili.', 'Richiede rettifiche per la clean surplus relation.', 'Lo spread (ROE − r) può non persistere.']
    }, {
      h: 'Quando usarlo',
      p: "Dividendi assenti/volatili, FCF negativi nell'orizzonte, o grande incertezza sul terminal value."
    }]
  }],
  cards: [{
    los: '26a',
    q: "Cos'è il residual income?",
    a: "L'utile netto in eccesso rispetto all'equity charge: RI = NI − (r × Equity)."
  }, {
    los: '26a',
    q: "Cos'è l'equity charge?",
    a: "Il costo in dollari del capitale azionario: r × book value dell'equity."
  }, {
    los: '26a',
    q: 'Formula di EVA e NOPAT?',
    a: "EVA = NOPAT − (C% × TC), con NOPAT = EBIT(1−t), C% = WACC, TC = capitale totale investito."
  }, {
    los: '26a',
    q: "Cos'è l'MVA?",
    a: "Market Value Added = market value dell'azienda − book value del capitale totale: il valore creato dal management."
  }, {
    los: '26c',
    q: 'Valore intrinseco con il RI model?',
    a: "V₀ = B₀ + Σ RI_t/(1+r)^t: book value corrente più il PV dei residual income futuri."
  }, {
    los: '26c',
    q: 'RI per azione in funzione del ROE?',
    a: "RI_t = E_t − r·B_{t−1} = (ROE − r) × B_{t−1}."
  }, {
    los: '26f',
    q: 'Single-stage residual income value?',
    a: "V₀ = B₀ + [(ROE − r)/(r − g)] × B₀."
  }, {
    los: '26e',
    q: 'Relazione tra residual income valuation e justified P/B?',
    a: "Il justified P/B deriva direttamente dal RI model: P₀/B₀ = 1 + PV dei RI futuri attesi / B₀. Il premio (o sconto) sul book value riflette i residual income attesi."
  }, {
    los: '26f',
    q: 'Quando il justified P/B è > 1?',
    a: "Quando ROE > r: l'azienda genera valore sopra il costo dell'equity. P₀/B₀ = (ROE − g)/(r − g)."
  }, {
    los: '26d',
    q: 'Perché lo spread (ROE − r) tende a erodersi?',
    a: "Per la concorrenza: i rendimenti in eccesso attirano nuovi entranti e gli spread tendono alla mean reversion."
  }, {
    los: '26h',
    q: 'Cosa indica un persistence factor ω = 1? E ω = 0?',
    a: "ω = 1: il RI resta allo stesso livello indefinitamente. ω = 0: nessun residual income dopo l'orizzonte di previsione."
  }, {
    los: '26g',
    q: "Cos'è la clean surplus relation?",
    a: "B_t = B_{t−1} + E_t − D_t: il book value cresce di utili meno dividendi. Violata quando poste vanno direttamente a OCI (es. FX translation, titoli AFS)."
  }, {
    los: '26j',
    q: 'Perché il terminal value pesa meno nel RI model?',
    a: "Gran parte del valore stimato è già contenuta nel book value corrente B₀, riducendo l'incertezza legata al valore terminale."
  }, {
    los: '26i',
    q: 'Quando è indicato il RI model?',
    a: "Dividendi assenti o volatili, FCF negativi nell'orizzonte di previsione, o grande incertezza sul terminal value."
  }, {
    los: '26j',
    q: 'Due debolezze del RI model?',
    a: "Dipende da dati contabili manipolabili e richiede rettifiche per la clean surplus relation; inoltre lo spread potrebbe non persistere."
  }, {
    los: '26b',
    q: 'Gli usi dei residual income models?',
    a: "Valutare singole azioni e indici azionari, e misurare l'impairment dell'avviamento. RI positivo = creazione di valore; il RI è detto anche profitto economico o abnormal earnings."
  }, {
    los: '26g',
    q: 'Come si ricava il growth rate implicito nel RI model?',
    a: "Dal single-stage dato il prezzo: P₀ = B₀ + (ROE−r)B₀/(r−g), si risolve per g: g = r − (ROE−r)×B₀/(P₀−B₀)."
  }, {
    los: '26k',
    q: 'I problemi contabili nell\u2019applicare il RI model?',
    a: "Violazioni della clean surplus, rettifiche per il fair value, intangibili, voci non ricorrenti, pratiche contabili aggressive, differenze internazionali."
  }, {
    los: '26l',
    q: 'Giudizio su un\u2019azione col RI model?',
    a: "Prezzo di mercato > V₀ (B₀ + PV dei RI) → sopravvalutata; uguale → equamente valutata; minore → sottovalutata."
  }, {
    los: '26a',
    q: 'Equity charge vs capital charge?',
    a: "Equity charge = r × book value dell'equity (usato nel RI). Capital charge dell'EVA = WACC × capitale totale investito: copre tutto il capitale, non solo l'equity."
  }, {
    los: '26a',
    q: 'EVA numerica: NOPAT 100, WACC 10%, TC 700.',
    a: "EVA = 100 − (0,10 × 700) = 100 − 70 = 30: l'impresa crea valore."
  }, {
    los: '26b',
    q: 'RI positivo vs negativo: cosa implicano?',
    a: "RI positivo: l'impresa genera più reddito del suo costo del capitale → crea valore (valutazione più alta). RI negativo: distrugge valore."
  }, {
    los: '26b',
    q: 'Altri nomi del residual income?',
    a: "Profitto economico (economic profit) o abnormal earnings: il profitto dopo aver dedotto il costo di tutto il capitale."
  }, {
    los: '26c',
    q: 'RI per azione: ROE 12%, r 10%, B_{t−1} $20.',
    a: "RI = (0,12 − 0,10) × 20 = $0,40 per azione."
  }, {
    los: '26d',
    q: 'I due driver fondamentali del residual income?',
    a: "Il ROE e il book value: RI = (ROE − r) × B. Lo spread determina il segno, il book value la scala."
  }, {
    los: '26f',
    q: 'Cosa rappresenta il premio sul book value?',
    a: "Il PV dei residual income futuri attesi: P₀ − B₀ = Σ RI_t/(1+r)^t. Premio positivo ↔ spread (ROE − r) atteso positivo."
  }, {
    los: '26h',
    q: 'Le quattro ipotesi sul continuing residual income?',
    a: "1) Persiste indefinitamente allo stesso livello (ω=1); 2) cessa subito (ω=0, il premio svanisce); 3) decade a zero nel tempo; 4) decade verso il livello medio di settore."
  }, {
    los: '26h',
    q: 'Effetto di un persistence factor più alto?',
    a: "Maggiore ω → maggiore il flusso di residual income nella fase terminale → terminal value e valore stimato più alti."
  }, {
    los: '26i',
    q: 'RI model vs DDM/FCF: la differenza chiave nel timing del valore?',
    a: "Il RI riconosce gran parte del valore subito (nel book value e nei primi RI), mentre DDM e FCF lo spostano sul terminal value lontano: meno incertezza terminale."
  }, {
    los: '26k',
    q: 'Esempi di violazione della clean surplus?',
    a: "Utili/perdite che vanno a OCI senza passare dal conto economico: variazioni non realizzate di fair value di certi strumenti, aggiustamenti da conversione valutaria."
  }],
  quiz: [{
    q: "Equity $100M, r = 8%, utile $11M. Residual income:",
    opts: ['$3M', '$8M', '$11M'],
    correct: 0,
    exp: "RI = 11 − (0,08 × 100) = $3M."
  }, {
    q: "Il residual income value si calcola come:",
    opts: ['B₀ + PV dei RI futuri', 'PV dei dividendi', 'FCFE/(r−g)'],
    correct: 0,
    exp: "V₀ = B₀ + Σ RI_t/(1+r)^t."
  }, {
    q: "NOPAT nell'EVA è pari a:",
    opts: ['EBIT(1−t)', 'NI + Dep', 'EBITDA(1−t)'],
    correct: 0,
    exp: "NOPAT = EBIT(1−t)."
  }, {
    q: "RI_t in funzione del ROE:",
    opts: ['(ROE − r) × B_{t−1}', 'ROE × B_t', '(r − g) × B₀'],
    correct: 0,
    exp: "RI_t = E_t − r·B_{t−1} = (ROE − r)·B_{t−1}."
  }, {
    q: "Se ROE > r, il justified P/B è:",
    opts: ['Maggiore di 1', 'Minore di 1', 'Uguale a 1'],
    correct: 0,
    exp: "ROE > r → creazione di valore → P/B > 1."
  }, {
    q: "ROE = 14%, r = 10%, g = 4%, B₀ = $20. Single-stage value:",
    opts: ['$20,00', '$33,33', '$28,00'],
    correct: 1,
    exp: "V₀ = 20 + (0,04/0,06)×20 = 20 + 13,33 = $33,33."
  }, {
    q: "Un persistence factor ω = 0 implica:",
    opts: ['RI costante per sempre', "Nessun RI dopo l'orizzonte di previsione", 'RI crescente'],
    correct: 1,
    exp: "ω = 0: il residual income cessa subito dopo l'orizzonte; ω = 1: persiste indefinitamente."
  }, {
    q: "La clean surplus relation è violata quando:",
    opts: ['Poste vanno direttamente a OCI bypassando il CE', "L'azienda paga dividendi", 'Il ROE supera r'],
    correct: 0,
    exp: "Es.: FX translation adjustments e titoli AFS che vanno a OCI senza passare dal conto economico."
  }, {
    q: "Un punto di forza del RI model è:",
    opts: ['Il terminal value pesa meno sul valore', 'Richiede dividendi stabili', 'Non usa dati contabili'],
    correct: 0,
    exp: "Gran parte del valore è nel book value corrente: minore incertezza terminale. Usa dati contabili (questo è anche la sua debolezza)."
  }, {
    q: "Il RI model è particolarmente indicato quando:",
    opts: ['I FCF attesi sono negativi', 'I dividendi sono stabili', 'Il book value è inaffidabile'],
    correct: 0,
    exp: "Con FCF negativi nell'orizzonte (o dividendi assenti), il RI model resta applicabile."
  }, {
    q: "L'MVA è:",
    opts: ['Market value − book value del capitale totale', 'NOPAT − equity charge', 'NI − dividendi'],
    correct: 0,
    exp: "MVA = valore di mercato dell'azienda − book value del capitale totale investito."
  }]
}, /* ================================================================== R27 */
{
  n: 27,
  key: 'r27',
  title: 'Private Company Valuation',
  sub: 'Normalizzazione, income/market/asset, CAPM esteso, DLOC/DLOM',
  weight: '11–14%',
  theory: [{
    code: '27(a-b)',
    title: 'Società private vs pubbliche · usi',
    imp: 'MEDIA',
    blocks: [{
      p: "Le private differiscono per: dimensione minore, stadio di vita più precoce, qualità/quantità inferiore dell'informazione, illiquidità delle azioni, proprietà concentrata, commistione tra interessi del management e fiscali."
    }, {
      p: "Usi della valutazione: transazioni (compravendita, IPO, finanziamento), compliance (financial reporting, fiscale), litigation. Il valore dipende dallo standard di valore e dalla prospettiva: controllo vs minoranza, commerciabile vs non commerciabile."
    }]
  }, {
    code: '27(c)',
    title: 'Normalizzazione dei flussi',
    imp: 'ALTA',
    blocks: [{
      p: "Gli utili si normalizzano per riflettere il potere di utile sostenibile: rettifica di remunerazioni eccessive/insufficienti dei proprietari-manager, spese personali a carico dell'azienda, transazioni con parti correlate non a condizioni di mercato (es. affitti), voci non ricorrenti."
    }]
  }, {
    code: '27(d-e)',
    title: 'Required return: CAPM, expanded CAPM, build-up',
    imp: 'ALTA',
    blocks: [{
      f: 'r = R_f + \\beta \\times ERP',
      cap: 'CAPM — generalmente inappropriato per le entità private.'
    }, {
      f: 'r = R_f + \\beta\\,ERP + SSP + CSRP',
      cap: 'Expanded CAPM: + small stock premium + company-specific risk premium.'
    }, {
      f: 'r = R_f + ERP + SSP + CSRP + IRP',
      cap: 'Build-up approach: senza beta, con industry risk premium. Usato quando mancano guideline public companies.'
    }]
  }, {
    code: '27(g)',
    title: 'Tre approcci di valutazione',
    imp: 'ALTA',
    blocks: [{
      h: 'Income approach',
      p: "Valore attuale dei redditi futuri attesi: free cash flow method (DCF multistadio), capitalized cash flow method, excess earnings method."
    }, {
      h: 'Market approach',
      p: "Multipli da comparabili: guideline public company method (GPCM), guideline transactions method (GTM), prior transaction method."
    }, {
      h: 'Asset-based approach',
      p: "Attività meno passività: tipicamente un floor di valore; poco adatto a going concern con molto valore immateriale."
    }]
  }, {
    code: '27(h)',
    title: 'Capitalized cash flow method',
    imp: 'ALTA',
    blocks: [{
      f: '\\text{Firm value} = \\dfrac{FCFF_1}{WACC - g_f}',
      cap: 'CCM: imprese stabili a crescita costante. Equity = Firm − debito (o direttamente FCFE₁/(r − g)).'
    }]
  }, {
    code: '27(f)',
    title: 'Sconti: DLOC & DLOM',
    imp: 'ALTA',
    blocks: [{
      f: 'DLOC = 1 - \\dfrac{1}{1 + \\text{Control premium}}',
      cap: 'Discount for Lack of Control: si applica solo in prospettiva di minoranza su un valore di base sviluppato come controllo. Es.: premio 15% → DLOC ≈ 13%.'
    }, {
      f: '\\text{Sconto totale} = 1 - (1 - DLOC)(1 - DLOM)',
      cap: 'Gli sconti si combinano moltiplicativamente, non sommandosi. Es.: 8% e 9% → 16,3%.'
    }, {
      h: 'Fattori che muovono il DLOM',
      p: "Aumentano: restrizioni alla vendita, assenza di prospettive di IPO/cessione, dividendi nulli. Riducono: dividendi pagati, prospettiva concreta di liquidità (IPO o vendita imminente)."
    }]
  }],
  cards: [{
    los: '27a',
    q: 'Tre differenze chiave tra private e pubbliche?',
    a: "Informazione di minore qualità/quantità, illiquidità delle azioni, proprietà concentrata (più dimensione minore e stadio di vita più precoce)."
  }, {
    los: '27b',
    q: 'I tre usi della valutazione di società private?',
    a: "Transazioni (compravendita, IPO, finanziamento), compliance (financial reporting, fiscale), litigation."
  }, {
    los: '27c',
    q: 'Perché si normalizzano gli utili di una privata?',
    a: "Per riflettere il potere di utile sostenibile: rettifica di remunerazioni dei proprietari, spese personali, transazioni con parti correlate non a mercato, voci non ricorrenti."
  }, {
    los: '27e',
    q: "Cosa aggiunge l'expanded CAPM al CAPM?",
    a: "Small stock premium e company-specific risk premium: r = R_f + β·ERP + SSP + CSRP."
  }, {
    los: '27e',
    q: 'Quando si usa il build-up approach e cosa lo distingue?',
    a: "Quando mancano guideline public companies: niente beta, e si aggiunge un industry risk premium oltre a ERP, SSP e CSRP."
  }, {
    los: '27g',
    q: 'I tre approcci di valutazione?',
    a: "Income (FCF method, capitalized cash flow, excess earnings), market (GPCM, GTM, prior transaction), asset-based (attività − passività, tipicamente un floor)."
  }, {
    los: '27g',
    q: 'GPCM vs GTM?',
    a: "GPCM: multipli da società pubbliche comparabili (con aggiustamenti). GTM: multipli da transazioni di acquisizione comparabili — già riflettono il premio di controllo."
  }, {
    los: '27h',
    q: 'Formula del capitalized cash flow method?',
    a: "Firm value = FCFF₁/(WACC − g_f), per imprese stabili a crescita costante. Equity = Firm − debito."
  }, {
    los: '27f',
    q: 'Formula del DLOC?',
    a: "DLOC = 1 − 1/(1 + control premium). Si applica solo valutando un'interessenza di minoranza su base di controllo."
  }, {
    los: '27f',
    q: 'Come si combinano DLOC e DLOM?',
    a: "Moltiplicativamente: sconto totale = 1 − (1 − DLOC)(1 − DLOM). Es.: 15% e 11% → 1 − 0,85·0,89 = 24,4%."
  }, {
    los: '27f',
    q: 'Due fattori che aumentano il DLOM?',
    a: "Restrizioni contrattuali alla vendita delle azioni e assenza di prospettive di liquidità (niente IPO/cessione attesa); anche dividendi nulli."
  }, {
    los: '27g',
    q: "Perché l'asset-based approach è spesso un floor?",
    a: "Ignora gran parte del valore immateriale e di avviamento di un going concern: cattura solo attività − passività."
  }, {
    los: '27a',
    q: 'Cosa rende più alto il required return di una privata?',
    a: "Premi addizionali per dimensione (size premium), rischio specifico dell'impresa e illiquidità."
  }, {
    los: '27b',
    q: 'Da cosa dipende il valore stimato di una stessa interessenza?',
    a: "Dallo standard di valore adottato e dalla prospettiva: controllo vs minoranza, commerciabile vs non commerciabile."
  }, {
    los: '27d',
    q: 'Quali fattori richiedono rettifiche nel tasso di sconto di una privata?',
    a: "Size premium (stimarlo da small cap pubbliche può avere bias verso l'alto: molte sono in difficoltà), inapplicabilità del CAPM puro (niente beta di mercato comparabile), da cui expanded CAPM o build-up."
  }, {
    los: '27a',
    q: 'I fattori company-specific di una privata?',
    a: "Stadio del ciclo di vita più precoce, dimensione minore, qualità del management e dell'informazione, commistione con interessi fiscali/personali. Possono essere positivi o negativi per il valore."
  }, {
    los: '27a',
    q: 'I fattori stock-specific di una privata?',
    a: "Illiquidità delle azioni, restrizioni alla vendita, concentrazione del controllo. Sono tipicamente negativi per la valutazione."
  }, {
    los: '27b',
    q: 'Le tre categorie di usi della valutazione di private?',
    a: "Transaction-related, compliance-related e litigation-related."
  }, {
    los: '27b',
    q: 'Esempi di transazioni che richiedono una valutazione?',
    a: "Finanziamento di venture capital, IPO, vendita dell'azienda, compensi azionari (con implicazioni contabili e fiscali per emittente e dipendente)."
  }, {
    los: '27b',
    q: 'Da cosa dipende fortemente la valutazione in sede di IPO?',
    a: "Dalle proiezioni di crescita futura della società, preparate con le banche d'investimento nel processo di quotazione."
  }, {
    los: '27b',
    q: 'I due focus della valutazione compliance-related?',
    a: "La rendicontazione finanziaria (es. impairment del goodwill) e la rendicontazione fiscale."
  }, {
    los: '27c',
    q: 'Effetto della normalizzazione di uno stipendio sopra mercato?',
    a: "Si sostituisce la remunerazione del proprietario-manager con quella di mercato: i costi scendono e gli utili normalizzati aumentano."
  }, {
    los: '27c',
    q: 'Immobile di proprietà usato dall\u2019azienda: come trattarlo?',
    a: "È un'attività non operativa: si valuta separatamente e si rettificano i flussi operativi imputando un affitto di mercato, per non distorcere il confronto."
  }, {
    los: '27e',
    q: 'CAPM vs expanded CAPM vs build-up: differenze chiave?',
    a: "CAPM: R_f + β·ERP (inadatto alle private). Expanded: + small stock premium + company-specific premium. Build-up: senza beta, + industry risk premium — quando mancano comparabili pubbliche."
  }, {
    los: '27g',
    q: "Cos'è l'excess earnings method?",
    a: "Metodo income che stima il valore degli intangibili: dal reddito normalizzato si deducono i rendimenti richiesti su working capital e fixed assets; l'eccesso, capitalizzato, è il valore degli intangibili (più WC e FA = valore dell'impresa)."
  }, {
    los: '27g',
    q: 'Quali multipli per quali società private?',
    a: "EBITDA/EBIT per private mature di maggiori dimensioni; multipli sul net income per le più piccole; multipli sui ricavi per le piccolissime."
  }, {
    los: '27g',
    q: "Cos'è il prior transaction method?",
    a: "Usa i prezzi di transazioni precedenti sulle azioni della stessa società: il più rilevante in teoria, ma spesso le transazioni sono poche, datate o non a condizioni di mercato."
  }, {
    los: '27f',
    q: 'Quando serve applicare il DLOC?',
    a: "Quando si valuta un'interessenza di minoranza partendo da un valore sviluppato su base di controllo (es. multipli da GTM, che incorporano il premio di controllo)."
  }, {
    los: '27f',
    q: 'Quando il DLOC NON è necessario?',
    a: "Quando il valore base riflette già prezzi di minoranza, come i multipli GPCM derivati dal trading di mercato di azioni pubbliche (prezzi di scambi tra azionisti di minoranza)."
  }, {
    los: '27h',
    q: 'CCM con FCFE: come si valuta direttamente l\u2019equity?',
    a: "Equity value = FCFE₁/(r − g): si capitalizza il flusso agli azionisti al costo dell'equity, senza passare dal firm value."
  }],
  quiz: [{
    q: "Control premium 15%. DLOC più vicino a:",
    opts: ['13%', '15%', '17%'],
    correct: 0,
    exp: "DLOC = 1 − 1/1,15 ≈ 13%."
  }, {
    q: "DLOC 8%, DLOM 9%. Sconto totale:",
    opts: ['17,0%', '16,3%', '15,0%'],
    correct: 1,
    exp: "1 − (0,92)(0,91) = 16,3%: gli sconti si combinano moltiplicativamente."
  }, {
    q: "Il capitalized cash flow method è:",
    opts: ['FCFF₁/(WACC − g_f)', 'B₀ + PV dei RI', 'EV/EBITDA'],
    correct: 0,
    exp: "CCM: per imprese stabili a crescita costante."
  }, {
    q: "L'approccio asset-based fornisce tipicamente:",
    opts: ['Un floor di valore', 'Il valore massimo', 'Il valore di mercato esatto'],
    correct: 0,
    exp: "Cattura attività − passività, ignorando l'immateriale di un going concern."
  }, {
    q: "Il DLOC si applica quando si valuta da prospettiva di:",
    opts: ['Controllo', 'Minoranza', 'Creditore'],
    correct: 1,
    exp: "Solo in prospettiva di minoranza, se il valore base è stato sviluppato su base di controllo."
  }, {
    q: "Per una privata molto piccola senza comparabili pubbliche si usa:",
    opts: ['CAPM puro', 'Build-up approach', 'DDM'],
    correct: 1,
    exp: "Il build-up somma premi al risk-free senza beta, includendo l'industry risk premium."
  }, {
    q: "L'expanded CAPM aggiunge al CAPM:",
    opts: ['Industry risk premium', 'Small stock premium e company-specific premium', 'Solo il size premium'],
    correct: 1,
    exp: "r = R_f + β·ERP + SSP + CSRP. L'industry risk premium appartiene al build-up."
  }, {
    q: "I multipli del guideline transactions method riflettono già:",
    opts: ['Lo sconto di minoranza', 'Il premio di controllo', 'Il DLOM'],
    correct: 1,
    exp: "Le transazioni di acquisizione incorporano il premio di controllo pagato dagli acquirenti."
  }, {
    q: "Stipendio del proprietario-manager sopra il mercato: la normalizzazione…",
    opts: ['Riduce gli utili', 'Aumenta gli utili normalizzati', 'Non ha effetto'],
    correct: 1,
    exp: "Si sostituisce la remunerazione eccessiva con quella di mercato: i costi scendono, gli utili normalizzati aumentano."
  }, {
    q: "Una prospettiva concreta di IPO imminente:",
    opts: ['Aumenta il DLOM', 'Riduce il DLOM', 'Aumenta il DLOC'],
    correct: 1,
    exp: "La liquidità attesa riduce lo sconto per mancanza di marketability."
  }]
}];

// ========== EQUITY VALUATION MODULE (Reading 22-27) — integrato nel tema FinLearn ==========
const EQ_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAEsCAMAAADZ8tmdAAAB/lBMVEXU3+JtoZpnmJSWoKubrK8cWluKmaJUXnBNYGxYmIus29Urqmpqd4qmzscNbxpWYHFHiHtqopkEJjJ1tHqZzbiXxLo0bmnQ2t0AMT5ydKpebYM1em04hncurq6yucQFBXo6hHWytdUoNk9//38A/wBhboJIh3p/f/8AAP87j4GIf46KmaJOdnYvNU0cXlACSz45kH5Jkn1V/6r//wA1OUk9joB40sOAe4j/AAD/AP8AAAAOK0cDaVgSMlEFc2IKIzsEcF4HHDL+/v4CW0x+fn8oeWk0NGgyhXU+f382Q1ksNlRVqqoqOE+pqapYZHoAAFVVVVUAVVV9e4gA//9Tl4pQlYgAf38xSGTV1uB///8kLUI1hnZJVmoTgm4jKz1ue4x+vr1LV2vLytRVqlVmmZkzZmZspZr2+vtWmItXZHiy1tAweWqLubBGinxzgZE9PT1qpJhteIlVVapGiHrV5+dVlIiKta1LWG5MjYFteYp5s6iNmKiuycZoZ2tmnJGux8cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA4fzXAAAAgHRSTlMiW55dIe6anunbHgRmUANjojL8BStPp0gECM5jpARbBmkj2AIBpXYCAeYe2QaoBvzE0AMBTGsR/QEBAP7+/v7+/v4H/gP5BPME+pAD+wNpAwMDHgGxzQL5GAL+0e79/8cE0RgDBQWMJ4/OMdVR0MYEca8D7CpvcrHOkW1xMwqPSfXFjLwAACYxSURBVHja7Z0He9tIlq7BJCqHdnbb7rY7b8/Mpnt37y0EgkXAIJfQWFyS0sqUxlIrp7ZsRduy/de3CokAiFRIFCXWPKN2q20afHX41XdOnaqiwAAO+BLAx7XaG/gLHJhnpgaRMwDP1mmaZh+BhSHo5MYagJNLNMuy9Dvwagg6Sdl4wyqDfjMEndj4BYBcgR2CTnoIAH6o0UPQScvGK0A9pnXOLDsEncxYRrKx1MXMsn8OQScxNpFsWDgPQSc0rh6z1jEEHf+YB+CTNZyHoJMYCwD+1MN5CDru0UTPudeDeQg6AdnILbHsEHTysvHOkfPQR8eapADwrMA6j2FExzfeAzC5xA5BJx3OL5FssOwQdMJD8JCNIeg4ZUOr8A9BJzpe4Qq/F+ch6JjcRt5LNob2Lja38cFTNoagYxkPrRX+IehkxrJbzm0dw6WsyDk3yPrKxjCi43ioCzbQGIKOMOa9cu4h6NhGHefc9BB08ub5wTobdAwnw/C1DZhZooegU8i5g8vGEHQE2cgVWJIxBB3abdBD0EmH80tAvWMJR8KgmxN1eNNACwFKdWmDFjQ9u0mgH/lV+PsAGoI/MhkYH+nrEdGnj9kQI0nQdXDVWV1tQ+HmgK4HK9U5gU5uhaW5CFurHLOaAZs3BbRS4WevHWhASascx8/Cxo83A/RDcLXHstcO9FOwjThzjPgHuBGgkXnOLLHXEPQifII4czx3BrZuAOiXuMLPhh+JgV6Ad1d5zJn/Df4Ib0BEU+ssex1BV8Eux/MINbeabwoDDlogz7nTAi0sjncYRuG8mkV6PdCgFwhLdWmCroO5VQZrNALd+Y9Gc4BBwy2Qvx+Vc2KgG6DF6WP1I5gY6IiOKhsJLmXVm+OSAZr7lwEGDWOQjQRT8AbIdjnz3JywMaigBfCYjWEkBPr/AWgKaIZvgekBBV0HuRfXGPQdmOF4I6AZRqKAMJigH4Eie41BA3DJdJWDZ7gMXBtI0Eih1+kYMNPJgBbAFdcFjVm3B3QyRKAfX2PQVbjLWcdqPgbt6A/oPTo65YRAo6eTGBvo3Rgc3mBGNE0rqN/A+EHXQWbVxpmTYqgsDWZEK/GMJ8OXsT/dBmxz9rGaiV7w6IfreAn+KwblQF/XIajG/GzvwdRqD2euA582byNoNaBxDv4HeCjE+mxVU5mjO6R7eGnzNoJW/8/StSwAcZJeFu6KjAPpNryNoGkz8ot8nKgnQJZzAM1IV1FJD6ZGWyRkMr52IgHsSIwdNI/HLGjcdtA0uzeHXjMW2k+bpjKHOQ1nJGpx+daC1jiztPwTjEs/Og7CweOCx3HE6XDQI1r7RSEDwdvIQT3RzKxyjqCRSkfswxtQ0Crh7t5aWi5S0Xs/BdDm3EBzmcXN2xjRtJKGdw0IXVqajBrUE+BQ4hxJ4y8dsHgbI7orG7pal+i9iE6vDh0DWgON8vDqbY1oW+mDXvoAwavQqOfBlHNAG0lL9VZqtEmg9ZycZtdzIGzcNatuAa3GNC/djWI8Bh80TdNG7YOll4rPQ+pHHexLjFdE860oIT3Q9s7M2cBeQ0H9OcRTNeAu4xXRyOFFCekBBk1bOBujRF/kAPm9IXXBK6B55PFwSE/cQtA07UKapuW/Q2JTPe1YH7Xm4asRQnrQQdPOY500qAVwl/MFHWU9fGB9tDohuqEuse/+AC8FEtBZzo80z3D3Fqu3EbS2Rus8ChkiD70v8Zwfaob/l9Bp/oCuGVrKdy6k2QsqsNNbBm1fzhh1+PRwYH00zXpEs5a/LGUCxl8d3Fv1QYy1A1c84MatAR1ANoxMcQ9Nir/6P5FXUmgSafw1E9J4DOaaIe1pObqokdMrBgtoz6QQr2WpXzjugKreHunQV8Fp/1Gis/C9z/PARb+A1jgrO+I+hlPpPoGmYyl1BABNl0eh34xYBxnOu8rBaaDxkODy8q2aDHUd9onokuzbC9qAvwVRaOSjlagOt3o4yKDZADMiXZL/2wd0FWRWg4BmGAU0I1GNH25dRAcYvqAB7PhjxnssEGjMmtsFG7cGtFHtjw76sxAgoJVQViIa/V8aD1HxHuQ1w7giuhNMoY2BQrp+S0DT8UlHHXzkOELS4jj5ivggZoY0GWjBiwoEQSyHDTTfIg/pwQNNhpmmX3uCrvqWR9V1LCVZYTTOjHSFz3S54QkLYUDTr//bA7TQhN4rsrbKv67S5K0HAxjRhOO1l0bXAwS02UgzqvlgVg9JVyUHDjQp55IX6OU6lHiODLUy+A61+P9vMmiaVDi8QW+A7cCYOcYEmuEyhFnLAEY0mUp7ga439iWCeDZx5pkO4SbPwQOt/i8e0D4tBraqv0k5lM70jRsKmiYqRAcALQCCgEbSgQNZT8U5nrAzfVBA06bdWHFp9ETwgNbq/lrJQwHNbROJx0BJB01Q8PcH/QO4u0oQ0LxJpDFoRjolScQHB7TRMxOX65gPsiJr044uaVxbglvXHjQdciLUlDoO0AI4XGUI5kKeMbkOZYh3CY6XHiTQ+qaVWEDDKmwzwXWD4S32Th1PCNZpBws0cV7oDnoDfOQYsrnQzpnh7gW3eCmAhr82I2s07doOHRI0bFAdhsBDcw6cGeYINuC1AS0AewccOWja1Hgez2RY9WsxsCeFjqC5w8DikTjoVwDmqUgRTYerJnmDFgKsyDr4OtvgO/CaSMfyQ5Dfk5cylqJiQNC0zdfFCXotUItBd1uFWhztCWh+9TjomXjJgkZ4R5YQoxVLukoQ0WqronYKChsbaMFyKmYg5XDQDlz+6FyLiH4EYFHhVPvDBpoO7jEiTIQeoLOrq6SOwwk0F3hFPEHQ+Ar1UW33HxUCNG1qSKJDa4cT6GVwSlJN4jlnlVYKeiIFlvsL+j2AWVkDGgJ0D9sYQT+F26uhs29LHo6+toIl4kmBhi8BvDDms5CgNeWIgFkFvWgXDqKANhrCekDjLxUx2GG8VGKy8WylS5MINM12a3R6BTpm0HPYQ/PR0kJjdpwLVMRLBjSa1Sdl0+kDNSLQdI/JCG+j6dI/HEDnRdWeRTHS2jcrhbm+RTR8qLmNkKDtPiNawtILGgqwHZiz3srhOBMizsy/opfrD2gsGwULSbr2P8FB00Zto7vnJ3xAO0kHsglXY5x6zYq/y9P6z22k9ePSufZ+v1xHtfcWSCLQrNXWsZHyQhcfvQxg5ls0vkdjW/KrkDI9NVIx+60yvmQzMGALb9yg4VtAPbbfSEEG2rLVm3gxNlgKbv5O1ls41F4wa7oy5vJS6YEW8J3TPRTJQXedBxvF23mUSdeqytisjkv+Et3Nv3m9fWYO/2l880JfUnCUc//kcJENAWhTBSlSIHtNhuaxBXYDLK6YzJwKutPfJsdXAD52usimF3SgZCUO0iVv0FCg/LpJje1YZme3SryBlorVbbhcHkssHTTL0rHEsx/oqm9A48TGFs88PvYH1pf7BBq5jQ8u918RRzSbEugf6uMBTo/oWf/Gs+MXwr7d2EA/RG6DdglUwojWS6PJg15wDWj9NANDO+wJi3g1vdwH0O+xbLjPcDXSohId1/AELYBxrwOrurCdqkpZMpWOB3QdXx7rDq8XdOz95h6g3few1MEXz9KSdqCBc1FJJNttGFNE73jefhVQo2lb42hsoL9zm719NrDwSqrNc47awe0SHa8XA+h5JBsrbHTQtMlEs3FNhQj0ZzfQdxz7/XlDL5Q45t1EmiHbbRgd9IJpJSUCaFsumAJoHNC8S9rds73QYR2Lb5HsgYsKGr4E1IXfbZv+oGmjLhpthZAE9FP40asX2hTUTqTxqbBTBKQjgsa1jRXfCpG/vaOj1UI9OLuCxlsMXfpG1VqSkX67LYEzR7CaUgPNZyQbAS6P9QNtXryKm7Or61gD2VWPBjDNb3BuTUrKPpbD1Jocqb0gl/T6gKaTiGads5uP/sV1i6Fe6Xd3duYmx39PHjR0LImGiuhkhifouvsWQ767FdmbM8NnAl/8S0WQZzi5FLCxy0+jEwtnV9DLE05lO/00MGP7hDdnhukE7vkPDRrXNgJ30Pm5jvRB44BmXEscpuNmPEHzXOCbDkOCFl6RXDntCZqOq1BHAloALnVovntghKmnwBU0Iya7Zohee3KJjgV0gurs4Tr+DQV0wef4E8dO3R47/SXgbsOQEW3t27jeoB0iuulS5dDnP15fkPUnLe4HC+kwoL+D+RWynRHuoGNLAr1A95B46mQ5DH12WLzyGLNgMyHQC83MEh0RNB365J44QDuW7dRo5ox4DsiZEYNdkxpKOgqEu9fcQIfZoEkO+p96QE/AHoXWj3jt6S/wH21YbyYBet5tCTZMRNPJiLQ3aMG69K3pBaeBZvTmgqCsUSJeTwJ0FfydjQt09P6YMKCr4IvhofluMxLPMUbCQhTSgXYbhgE9w8YX0XTyoO0aLdSpbpVDL9bxnNXYkQyUtQjXBbTT4qzRbJ6sSPeArpuWvnleX4Plw4NmOuDaSEcv6G77Ysr2brlB/caYDg403IapmERK+ou/SqcAmnYDnWD+7ZGCd8t2Kl1jPuQMA03KmRF3fMWjb5MhHW37oDdoW61DsFU5CmaBNhmPsJwZpuWbiKcU0Q6ToS7PSSyseID+rCu0JhmmTIXjw1FWE/Hlfk+GtFtE00kaadoF9CIYFxkj4eat2sEwYUEzWb9EPPmIpj2kIwHTgfXZw3XUQVbfJaRz1pOVgPU6F4vnl4j3T6MTK9wpGu0S0fPGfafGWpXeYKfmLWFBo6ylDq/pZJhArqKQ9bJ3VdhiTG0yRgcH33MoJnFIf/QOaXLQQhjQfziCjt10aKBdJ8O6qX2UN6/ARpsKtZD2PNmxr6Dj7P6y5ymOtY6nsGVbTdGTcC6SbighfezppRMHreB0Ax2rfCjRXLIkK2iUTaDrYMpUtuvm3VFlQx0S7Kd00P6gYzXQPQFdlucN0NN6QPOW/kW9fhdt8Py2l0onPRmqCNIB7Sgd5RVjnfrfFqc0D813DzvBlLXWgoig8WGly/300alFtDPodfgd1Jdk29r5PGqZg9HXYHmGiZCrdEm3PE6ySiOiUwPtRJr+AB5pC1jgq2iANg7etm6JjTbEu+5Nj4lqtAGgf6DL8qmuHD/gwyP0HMW8/yc+1h4r4kmC7jq3foEul8p70LAc9ySGtySEPX240VBXKsy563yYKOj0I9qOuvz6kx7QygW+1hzF5Zik0JwrlRPXrCU50OaTkNIC3RPT2HPoVY4pybJtwulcVz4qaPflwwQjmk5bOnptdLmkX5gO6+r557x5g0pPOEdJWxBmpVyavuug09doW0TT5Zr+Ua6DQ8VD892iqOMpmGS9Mz2c+wI6LddR0oO5h3OJntS3xjdg29gzqObcztsHSZrBFL4m3cAGb87tnON+gY5/lbBXoelS7Y8FPaDviermwG4tyV6t4xm9dYYn4Wy+CUf8GS70IaK7YZss6JLLTEijgH6p/6VtxnJPHt8bz90dFcE5i7NoPHny5D4aT+7vfgXNVKWDTlM6SuqqipONrkEtoKuLmVXGOO+rW00yt37ptQ8Cja7whwlu6AwI2lLWT3gyLGlBbY9oI6Ah6PCmk9V4x330vL55k6jN4C9bExMTW+rY7E/1zkTCdSkruXo/8najUPhVe2T1QH/euKuG05lGLCWJp2C5jxFtA80mC9o0+Vk40zltbxoU4KVmORiLRofr/7Isq5wFvU0hKdB0P0DTtvqosWNFOfS1e4l613VEBY13ZSUHeoZQOZxAJywbuGyX088eaII72k1i5qVCJhbQfCbghVkJdiqZNZpKCLQr5lL5Anb3YFFS91B+fSp0OR6CfKUQNvslHb3duElFtCvncrn2vHuYxgbcVVI4nnMtJ4VX6VywjYbJaTTdV9ClD+Ct+am/SKKpfzQ+zrifYzGZ86OFoBHNJgu65DXKBWrB9ImGdQDvHZ9lZttSvPGMp8N8QieiBwWddER7cqY/OZ/CA+H4+RMp1ohmZuF0X0A7tcSkChr9J5SrzNs+zzC/OTHRUH95d7sjMsSFDfeQFhZSB+1yx0TKoMvI5fzi+PDNH5treO6CV9kDTj3VLjrpLGikDJruFjqSB+1Kmi7ROc/ju6BwB3/NHIlxtChVKuJ4gB2diSxl0f2VjtKe25GCJtZYVw/bYvSArlSY7QAhHTdo5+bQNEHTZfn5wi/+7wPiKDy85CKDDpaHx63RKYF2amc0SOeCHu2M9AUeH0T3Hfyxfx4eC2jafH6r04g/BfcAXSS4rhujbkUn3fFPw+OJ6O79js5YYl/Kcs8IseMgOW64ivQjelBnwFZqoL2Ok4kVdMlVN8poyKZ1wkADTgCYjarTo1BIR6N92MQb0V3DTPeCLsJHpO9oA4CMpK8MhFRp3zM7woPuHujfdc5sYNBs/NqsgFar/W/fCmuQIKg3ADXLRQFdOYIL/55Q9Y6mg4d0bBFdKnnXOOSd7l/z6lVjAY35IMQbSD44PnxZryLeBT8kUfin7Se4epIuybGBpn1IvxjdezMy839mcg9MyF8KePjZDyQfEUz1rM/x6NFWWLq2OQXQJavdoN2mQzRKtDxa+6aw9/vId3nKIP45/4vHVsBp8PUkSmnpamM5kYg2zibQy/we8mED/TYE6FKAIrQNuPrjkFdW/noxkntk8P6cd518qPsRSO96p0mhNbq7H9Nfo3tA/zWMoSPgbPYl5bI6TYwWiyPPKe0x3q4tO7qPLFcJHdKUp/GI4jq6kuEzF9pAL8Ai8bbjUqlEFNJd0uofU0L8NcY9+Qxqz7Iw3yvUI4XQIf0lCdCma+iDsLKAhhDulUNyJo5pe95YLrE1eWV0JqcqydsFy4Wx6NdzYmjj4XnwbljQessGSwYawkXhLwCMliNngSEHDm6MW5bX382ob35LMMGeBvmT8NXS2EHThDu5NdCCmrTBBytlgknQw2RECG406Np9BFuB/NlIJzfBaTtkSEvQvWs3Omg6IOi8oEZ0fuRifakUz1p3FBFR22xKJaTaIypsYV4TajjLVMKENP/R47yflEDPq5CzxRWZpV+U6D6DtsZ2SV4v5qD25gDO8L6IlTDu4wDWkwEd+KgNGYJnk3u1bsv4dcFseO7XtYvMA80T/VAF52KYmOYz7r2l6UQ0++e6zOKEjaSYVEqOc1mVDbOOlMuyvPdBCey39Wm1/zREacn1qqEIriOh4y6DFTUig+75V+y1S7UX7xTj9zdAtcl3LFdE96uGQkd0YoiTsXWBYluRkdejxU+YCpoSw4R0IxkfnSDotEYv6nJpVJkcMyJ50vI15i3KiYPu2TKYpIqUDf0o6+W/16PvcuD0gHhKbIGBiujuLgnaedEq/qAul02Yle+9Xpl58DtxSO+7NEldU9D2qlAXQpBB+KPR/pD5j2vflv/z9wJxtbQ+SNKhYNKjDLtCWa7JtdqLwvr6+uibP38fsYw/3zze21tfL7yoKUOWZdqKPQBoazzrYf5NmS3EU1q6jqA1xjQCJhdWHv/508zMZC734AG147vKukM9ePAgl5uc+ZB9s7f+4jV6BW1+KweOaK3M1/3mNwRKXWG+wDv9S1gCI8alHgx4dPTNzMynZw8giDTgg9ynmZl3oyuyQbzsVvowOJdLZh0pE6LGIQ2vL2jlzdL069roXjE78pWClmd9+1IQHuWf+69nC/Pz88/zjwThpa3PH1LPRor3R0dfm5e5dOiWiHaYDZTfWQgc0tuOeXj/QSsfalpeWUeEc390Cb/9vJmfBxEj+nl+83MXOqTyuZFicaX22hzcBl39h2AJcOM/lNhKsCLeKHRqW+oraPwppWsrLy5Gcnl9NQ+8fIT5NkGMA/4KBERc36a183xupPjXmmzEtolm2Uhg7NOpp4JUzAsAOaeQDgU6ltM1SiW2Vlv/fTK3Y3RfPFoQBAiSG1AQ5g1V2cnNvFmXa7Q1tsvGhtBe3+KB2nwQTeUENoVrENHKpim2Jo++m3ymMX77NmBDUSyjCd8vLLx9qKJ/NlNceS2blMPSH1I2GxZVxksVt5UsnXOFyTiUltICXTJsRQl5CstS9Dzoy5if1/ow4GmuiKZJ2mxJekF3Z0znebHS5cwcOWyISzOi8ULhkrFyhF4pL4A+D6g9AoTPRy5W/mEWZAtom8uuuB58p4AWD5vVGBpohL+HcW/YWBRH9DnvUb4Jrs0Q8uo0uZMfKY7KJbvH65kZXQVE48wwlzFMhr/+BcyQqzKa9kbyqiK/zEMIrttA09emDnuvJtsx28y1kpxXbPpsJi1+BXcigkafNLhHJs5ybe+DZi2EZF1F1MgWhLeqH3m3Lpe+sWSRDjlM11dbPIfyL+2eJl6KGHNmhcAms/LKu0+nSrdy433ajOfH19buVKvuewCraNxZs8wUy+9fvcL//Joblf+hVFycOJdLlqiumD2H8ksU0vXwoIXvAMit0+XAU9/KRVbT5BQDGY4LvWyhw+jpcdR3Cait1HDnE3J+pR6NNpebFANS0bXDBJq5hPOhQb8H4OqNHNTM1VY+aL0Sayn5t+X5hYVGw8SYejB1fnz2/c/Z7BgaJ1J3nOBvjGW//Xbm7PjjlLn/Um9ynldh5z6syCWnAoiRrBeM4zIrJtCVwj3bAgBFgHknuxRkURZRXkJTn/L4j1IxcCjjuzPxUM/4HhxmjrNj7c6BKOLTUCwHGJj/RTtGGv2mg4NOeyybObQWC2FeZY0E232FQTUgPZwrlRashgGNngB+WvG/4Ar9zWxtL3elNA+mkew1m/Ob2jvaoeZy2cv7mG7PyYE6X9OvtJMNMBn8TcSmIBYOxkbMB9nB959V1rJsLYtYIvsbs0IrQoL+IVLWtqVgoFEO9Wxd9u9MKsu1xxlKLVykEMvNfFWvyo1k759IRKvW9qOr+EKhcDL7c85Wz1JLrjBXrL3uLgrYlETXD8vIWs8aogKG8zvZv0eXXXqco9S0OgVFXtNmuakR5QAf0mYXDTMKP04UkV6fnU+5fQDhe+Xrp+Io7ZQ5aisDdtCF8Q2BCDQ+qDe34tOYhCxGbW9kB6ZDWf9QwqmztlQgY2yKYiQe4slldmTKtM5QtS+tCsifLAN1lyjM7clONgSnNKwdNJO1bGrxBY1+KtQ7X2VGiZ9i5B79krhcLG8oFRsqtzsmisT71ZRAVpK3k6PWyOG4gfjOZt4c0cLyD0K9Wp1Wq0ONanWjrnTEUh9WXju4EMV/2EiLlk3pPqDhW/RjrHl7jZK8kv2KH3ITJm8vlESZOsxeiiG3QCDQonSQHcmfak87sbnWbJpPFIM/rG1Nm9Z7d3a031ndFJSwfiw7mj37pMhbNrV4g0YTMLXntU8FJ9jvFL8sJF/BmFemvv2PLUkMJchIRxnpoL2d0WzcxFrdVhIQ1jYNvuNz5yPZ2fsno2jcb41k9qEa+BiaEtYObq9icXmWZVq/iB7xCGe8DnWRUXQ5+cxvGW9MhV+3n0ghNmwrnPGkd/ZVfdDpjQ2b+Zxfe6hnlvewhTkROW22rKgOUDrJno/jP/O3hzis12WnldyCJT/cNpWWPEAjTbp67OowUDCzS5NflVwm+VjG+R68t4vefbhdxBwntY81W7FYv2t9YLi2oIkGdY4Qi+4vIl7u4hdRpvuv70Z7jR4O6m4ebg5pymsWxOHsOpYuPsFUqhhwAWO+u31CDFmPffFk+56qbFX7oQfLdS1pf5D7GU+unImTg+1G/2H0yz4SHEWtR3pyRqXS1H2B7e5hOJS7d6Yu3NVZLrzDf/LzfPLTH56Xrs4uw4Uyz4gHrawawZtrPWXRuqL68OvZ2IEoep43qGc3vHQ/e1cJacWE5C/ksj2sS90qkwiNvI1yC2eYWXLMBPG35D01mJM3zFjjds6PxHA373JSJ6uats16s2mv9CuaDO8etw/EQFdliVJnLDt3ag4C9OX5T3KPghSMBYEvhko7g0am7ie3jJtdyeaVFa3k68mLGEQWpX1MgfDMEnxtlXiZmVJzkB55m99Uq0Yjs5Jk6cpwf7F2VttMBO5AK2pqBmeMFtTfaLPoP4tUXXAHDbupYM+xJPI6thmvFpKvFykfze0jUcngiG9TEo+Ox5VUo+dadLg2rWQe59mAUysvnsweq5wajQ27WL5/hT3Iin05V58Tv+idBw6gqwBOys55tqzux0uhXoSt/tSumvkRYkYf8tltxWE0xp2Td7h/fCkyAXZtoqxDvPyiWcLquHuNAtm9f1jnxIIe0o1lZ9DwpZKjOEnz6IfxdBZLBIwjc0maYKsyLt7PKHb3Tk84CAuaSxwL9Mr4c9HSeiO8Fy9w6Rmhfm1NyfWQrjuCxrJRc8wA1/EE+DCFYFYq5plOGC/HS53tfWXyW+61L/iU3Z3DXSno8dFiJ6u+1njA1VQliTHlMErxY1Tz0pT9EwsnazZ1ZnHRaC+HS/kwHczwvBPmGClOah0qytb8sSev3FQmPzV5D6LMnLR7TwnloJWFJj4UMl+UzdMittRMDqz1gkZu47HVPCvOQ/4JY36fUjTDbXw+PHFAi5cfd5zdkHKJNMxnDwKXSMS2UlmoE8mkUrbGi9cW91EZgz3SAR+CfMFa38dnJdWKX9U1w+SHhjmEaVYDsNdjqDM33P/SCfijw8qcnVJeK1Sd3OpAEGnuXPHSlOWJPsl2U8cWPkDNayXvNKY1zGS6oXg5/JDV3nOSlvH0Rx0fKbMfHwizdKa8VkiVRPGIPFv5G2NWZBj1wl/KLM9F1mabUXKCfkMjHczaFEh2ewciU8jew1Tu9gbYBp5WD1tScBniOtmocYWnxZlad+mlspoBT02g82DH1uqFMGOjsZVK7wv+Sw6x0yDVZnH3rvZTcvrJ7RMIc4Xhjj6i56hG7b9EqE+LstGHWhiDSOt10FieS5YpkFX8XDUdzCj0plAOUeCCnyiglJg7eALcclBmRe6nsiKJAkkfY3rD+CXyRaMEUjlHT0MZ7lm2ZCfsxSQu6KfTyYXXJVsSz5BZDR55A4A7uRxXhpTLEoIf2aNhrsPY3hHAs6K6T3EFLghUN0sxCbR8kVHWTVLBDBsAHovEoiG2FJ+x7IL5jCzjEfEUuBFjXGFbPaOXq4uaRjdA1uCMe43uZ9SmmVTGhirOhUKByGi0plykWUBG43RbJDnVpCK2xuOLZn18h0v6pW800pRinz8Ytq5Uptc/pYhZWAQUVlICzjzjhXkayWMLublC8Ct6mSMUWE8TeHOfAZgcVayejDuL3oKifh0CXaIVp5Ha3hKUs50j98VzRNrc2tcEwima557gFyOwiOJuYu8YTz5F+Rss09SvGmf1PgQFcz0tzMJDcNrieI4oERRbyM9NL7vMQOOzpP7w6CrJd4zbvEbx9Yooou/rOTe7hN36Qmo941V8mg7RPY7I6raRaEzXXTDvt0g7PsRjNEUl+QEWXqFEUC6vUKBorAQWU8WMpmBqVkkECcxzJ+P2iWuEwcwd5ZP/AKMfY66Yo7LaXku5+DxVzOjtHUpYS40rjb2zEyS63BM3zLiac0qKuVLh0Ce4kfxbVevR+ODbEi3/hDTkZYq7eer4UGxtVQSLtE+BA/0uTvro4jTw6fpwWyQ+UPTgEPgczB+bqd5aoFZQ9sKu51Aim+4Wy31TQhHk2mgJl7ccT+8TtgD8SLwgw3AtKqU6jlqP/iDLLyZBio4OaFdEENX2OWw16i5SD+aOyBcKGJQK3knxPVPgWS6tsr6pINvCs2Bgs8F1UEbRgG6Vsl3lxQgXCjIxnwniC1pIGzNydftPiMrO0jYE04JLmQTgMgnxAuP9/RS6uW0R/SjdYxzgX7Db4IKnKRyuQ6y5lUnyRyFOEGVmQRpuwwY63dFUjvws4CAMtjLY+ehWI8Z7mHZDtD5iV9e4C2426A0Avzhu3HEL56xrHWKDeEbVRxaC9A8KoVKWZ+qSK3SrcN4xXWEuxz0St//JikwY0HMpT4N9AF0Ha53uHWu+yiFuuyZude0KQvJeXnEOTABws0FPgK9KawzH+ykHBsg9cQ1nWA19U6w0534M/00BvQXOJfVueb8wVPbCH+PbZ9yqNPc6ITmP94lziqC3wLFi6/ggboNHns6t1R2F8/8NefHg2L7HTSk3BPQWOOOMsoYfapy3uUQenAD7bY4PQ7oi9Y9zaqC3wM9ct37keSFEhevcc8kEFdlAAsSHaTat/NZHzmmB/hv4XnNiCmVvU7cLXYV0Dd8NGyLlVj4mVy4J5g0CvaVwNsLQTTmU72PZcPPOD0H+kgk5pHw/OacDuqpy1st1inDwjl5DqRK7dWUh2ciExYz981Nww0FvgYy6Nmgcs+P44VcWWs6gaz6BwnxXisB5E9xw0BPYb3CBVrt/m3Jfgaiq8hxucH2O5zRAC0o88wHyZe7JqXm3pJ3zVTss5wqX7as+pwL6qaobvOWILjcarld6wWkwF1o28Kk7DXDDQcNFSgpWFuU/unfaI87nXHjOTwCANx30GnggeR8hpc2O0pzHakEDbIfnXDmBYB7cdNBgEc4Wur6CM8jaSP/rqXvhebkKwk+DTEWcSq+bsI+gm2CtZewI1uv05hxc2SLxxKNRGFG6zzEcHxK01/2kN8p14KW98+yYcpKAXvQ3TYv4V9K2x66+O+D0fpBVL9fFsL4bjrR8tLJfGI6PzEqmYxsM0ng9/KPH4tImoMaYCKBb8GHzloAGercAnMu2DiTzEUWKWqNpcBq4c54KbevwROhyc9XNLZNCuKmc4wSvMm3l/CKjr0PKe7RmbYKvUiUCaPHwGhiOVEErOaJ2WBSgMmftA049zmFs32OuWgP3onBmuLNrMRGmDVqJ6Lp+aDk8P9sdk7LenK8i6AYabXgH3lLQqjEWGrqgeLWxLoPTE56LwLkzDq7NJRlU3/7m5tqEVmR25bwzpq9Z8SESb+bg7nUR6L6C9hWZJmwz3eWvoDajoh9gVWhRrjWqIWhLeXVfIg1njhdF8WC0nZ3JTEEABDAEHSimM7tjRwcHhYKIh7pliLOUovCNCMp/PDg4OGqPfZ/JHHYPkK/+CIagycaDqXvnueOzzM/ff/9ta6yNBr5G5dtvf/757Dhzfj41dWqe9HD2s1Gfv2Z3Rf0v/OroPUUHa9kAAAAASUVORK5CYII=';
const EQ_EMOJI = {
  22: '🧭',
  23: '💵',
  24: '🌊',
  25: '⚖️',
  26: '📐',
  27: '🏛️'
};
const EQ_TABS = [{
  id: 'theory',
  label: 'Teoria',
  Icon: BookOpen
}, {
  id: 'cards',
  label: 'Flashcard',
  Icon: Layers
}, {
  id: 'quiz',
  label: 'Quiz',
  Icon: Target
}];
function EquityModule({
  th,
  theme,
  onClose,
  onReward,
  rewarded,
  markRewarded
}) {
  const [reading, setReading] = useState(null); // indice EQ_READINGS o null = lista
  const [tab, setTab] = useState('theory');
  const r = reading !== null ? EQ_READINGS[reading] : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 overflow-y-auto",
    style: {
      background: th.bg
    }
  }, theme === 'dark' && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 fl-grid-bg opacity-40 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative max-w-xl mx-auto px-4 pb-24 pt-5"
  }, reading === null ?
  /*#__PURE__*/
  /* ---- LISTA READING ---- */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "flex items-center gap-1.5 text-sm font-bold text-amber-500 mb-5"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), "Studia"), /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up relative overflow-hidden rounded-3xl p-5 text-white mb-6 fl-sweep",
    style: {
      background: 'linear-gradient(125deg, #b45309 0%, #f59e0b 45%, #d97706 100%)',
      boxShadow: '0 20px 50px -20px rgba(245,158,11,.55)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden p-2 shrink-0 fl-float"
  }, /*#__PURE__*/React.createElement("img", {
    src: EQ_LOGO,
    alt: "",
    className: "w-full h-auto select-none",
    draggable: false
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fl-mono text-amber-100/80 font-semibold mb-1",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em'
    }
  }, "CFA LEVEL II \xB7 EQUITY INVESTMENTS"), /*#__PURE__*/React.createElement("h1", {
    className: "fl-display text-2xl font-bold leading-tight"
  }, "Equity Valuation"))), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-50/90 text-sm mt-1 font-medium"
  }, "Reading 22\u201327 \xB7 teoria LOS-completa \xB7 ", EQ_READINGS.reduce((s, x) => s + x.cards.length, 0), " flashcard \xB7 ", EQ_READINGS.reduce((s, x) => s + x.quiz.length, 0), " quiz")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, EQ_READINGS.map((rd, i) => {
    const done = rewarded.includes(rd.key);
    return /*#__PURE__*/React.createElement("button", {
      key: rd.key,
      onClick: () => {
        setReading(i);
        setTab('theory');
      },
      className: "fl-card-hover fl-fade-up w-full flex items-center gap-4 p-4 rounded-2xl border text-left",
      style: {
        animationDelay: `${i * 55}ms`,
        backgroundColor: th.card,
        borderColor: done ? 'rgba(52,211,153,.5)' : th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
      style: {
        background: theme === 'dark' ? 'rgba(5,8,16,0.6)' : '#fef3c7',
        fontSize: 26
      }
    }, EQ_EMOJI[rd.n]), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono font-bold px-1.5 py-0.5 rounded",
      style: {
        fontSize: 10,
        background: 'rgba(245,158,11,.15)',
        color: '#f5d061'
      }
    }, "R", rd.n), /*#__PURE__*/React.createElement("span", {
      className: "fl-mono",
      style: {
        fontSize: 10,
        color: th.textMuted
      }
    }, "peso ", rd.weight), done && /*#__PURE__*/React.createElement(Check, {
      size: 14,
      className: "text-emerald-400"
    })), /*#__PURE__*/React.createElement("h3", {
      className: "font-bold leading-snug mt-0.5",
      style: {
        color: th.text,
        fontSize: 15
      }
    }, rd.title), /*#__PURE__*/React.createElement("p", {
      className: "mt-0.5 truncate",
      style: {
        fontSize: 12,
        color: th.textMuted
      }
    }, rd.sub, " \xB7 ", rd.cards.length, " card \xB7 ", rd.quiz.length, " quiz")), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 18,
      style: {
        color: '#f59e0b'
      }
    }));
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-center mt-6 fl-mono",
    style: {
      fontSize: 10,
      color: th.textMuted
    }
  }, "QUIZ \u226570% \u2192 +50 XP \xB7 +15 \uD83E\uDE99 (una volta per reading)")) :
  /*#__PURE__*/
  /* ---- READING APERTO ---- */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setReading(null),
    className: "flex items-center gap-1.5 text-sm font-bold text-amber-500 mb-4"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), "Reading 22\u201327"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 mb-4 fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 fl-float",
    style: {
      background: theme === 'dark' ? 'rgba(5,8,16,0.6)' : '#fef3c7',
      fontSize: 28
    }
  }, EQ_EMOJI[r.n]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold px-1.5 py-0.5 rounded",
    style: {
      fontSize: 10,
      background: 'rgba(245,158,11,.15)',
      color: '#f5d061'
    }
  }, "Reading ", r.n, " \xB7 peso ", r.weight), /*#__PURE__*/React.createElement("h1", {
    className: "fl-display font-bold leading-tight mt-1",
    style: {
      color: th.text,
      fontSize: 20
    }
  }, r.title))), /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-2xl p-1.5 flex gap-1 mb-5 sticky top-3 z-20 shadow-xl"
  }, EQ_TABS.map(({
    id,
    label,
    Icon
  }) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTab(id),
      className: "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all",
      style: on ? {
        background: 'linear-gradient(110deg,#d97706,#f59e0b)',
        color: '#fff',
        boxShadow: '0 8px 20px -10px rgba(245,158,11,.6)'
      } : {
        color: th.textMuted
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 15
    }), label);
  })), tab === 'theory' && /*#__PURE__*/React.createElement(EqTheory, {
    sections: r.theory,
    th: th,
    theme: theme
  }), tab === 'cards' && /*#__PURE__*/React.createElement(EqCards, {
    key: r.key,
    cards: r.cards,
    th: th,
    theme: theme
  }), tab === 'quiz' && /*#__PURE__*/React.createElement(EqQuiz, {
    key: r.key,
    r: r,
    th: th,
    theme: theme,
    onReward: onReward,
    rewarded: rewarded,
    markRewarded: markRewarded
  }))));
}

/* ---- TEORIA ---- */
function EqTheory({
  sections,
  th,
  theme
}) {
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, sections.map((sec, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `rounded-2xl overflow-hidden fl-fade-up ${isOpen ? 'fl-glass' : ''}`,
      style: {
        animationDelay: `${i * 40}ms`,
        backgroundColor: isOpen ? undefined : th.card,
        border: `1px solid ${isOpen ? 'rgba(232,185,49,.3)' : th.cardBorder}`
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      className: "w-full flex items-center gap-3 p-4 text-left"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono font-bold px-2 py-1 rounded-lg shrink-0",
      style: {
        fontSize: 10,
        background: 'rgba(245,158,11,.12)',
        color: '#f5d061'
      }
    }, sec.code), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 font-bold leading-snug",
      style: {
        color: th.text,
        fontSize: 14
      }
    }, sec.title), sec.imp === 'ALTA' && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, "\uD83D\uDD25"), /*#__PURE__*/React.createElement(ChevronDown, {
      size: 17,
      style: {
        color: th.textMuted,
        transform: isOpen ? 'rotate(180deg)' : 'none',
        transition: 'transform .3s'
      }
    })), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "px-4 pb-5 space-y-4 fl-fade-up"
    }, sec.blocks.map((blk, j) => /*#__PURE__*/React.createElement("div", {
      key: j
    }, blk.h && /*#__PURE__*/React.createElement("h4", {
      className: "font-bold tracking-wide uppercase mb-1.5 flex items-center gap-1.5",
      style: {
        fontSize: 11,
        color: '#f5d061'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-1 h-1 rounded-full bg-amber-400"
    }), blk.h), blk.f && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl px-3 py-4 my-2 overflow-x-auto text-center",
      style: {
        background: theme === 'dark' ? 'rgba(5,8,16,.6)' : '#fff',
        border: '1px solid rgba(232,185,49,.25)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: th.text
      }
    }, /*#__PURE__*/React.createElement(MathFormula, {
      formula: blk.f,
      display: true
    })), blk.cap && /*#__PURE__*/React.createElement("div", {
      className: "mt-2 leading-snug",
      style: {
        fontSize: 11,
        color: th.textMuted
      }
    }, blk.cap)), blk.p && /*#__PURE__*/React.createElement("p", {
      className: "leading-relaxed",
      style: {
        fontSize: 14,
        color: th.textSecondary
      }
    }, blk.p), blk.list && /*#__PURE__*/React.createElement("ul", {
      className: "space-y-1.5 mt-1"
    }, blk.list.map((li, k) => /*#__PURE__*/React.createElement("li", {
      key: k,
      className: "flex gap-2.5 leading-snug",
      style: {
        fontSize: 14,
        color: th.textSecondary
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono font-bold shrink-0",
      style: {
        fontSize: 11,
        color: '#f5d061',
        marginTop: 2
      }
    }, String(k + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", null, li))))))));
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-center pt-1 fl-mono",
    style: {
      fontSize: 10,
      color: th.textMuted
    }
  }, "\uD83D\uDD25 = LOS AD ALTA PROBABILIT\xC0 D'ESAME"));
}

/* ---- FLASHCARD ---- */
function EqCards({
  cards,
  th,
  theme
}) {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [done, setDone] = useState({});
  const total = cards.length;
  const card = cards[idx];
  const go = d => {
    setFlip(false);
    setTimeout(() => setIdx(i => (i + d + total) % total), 130);
  };
  const rate = id => {
    setDone(p => ({
      ...p,
      [idx]: id
    }));
    if (idx < total - 1) go(1);
  };
  const RATE = [{
    id: 'again',
    label: 'Ripeti',
    col: '#fb7185'
  }, {
    id: 'hard',
    label: 'Difficile',
    col: '#fbbf24'
  }, {
    id: 'good',
    label: 'Bene',
    col: '#60a5fa'
  }, {
    id: 'easy',
    label: 'Facile',
    col: '#34d399'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2 px-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-semibold",
    style: {
      fontSize: 11,
      color: th.textMuted
    }
  }, "CARTA ", idx + 1, " / ", total, " \xB7 LOS ", card.los.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "fl-mono",
    style: {
      fontSize: 11,
      color: th.textMuted
    }
  }, Object.keys(done).length, " riviste")), /*#__PURE__*/React.createElement("div", {
    className: "h-1.5 rounded-full mb-5 overflow-hidden",
    style: {
      background: 'rgba(232,185,49,.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-500",
    style: {
      width: `${Object.keys(done).length / total * 100}%`,
      background: 'linear-gradient(90deg,#d97706,#f5d061)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      perspective: 1400,
      minHeight: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full",
    style: {
      minHeight: 260,
      transformStyle: 'preserve-3d',
      transition: 'transform .55s cubic-bezier(.4,0,.2,1)',
      transform: flip ? 'rotateY(180deg)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFlip(true),
    className: "fl-glass absolute inset-0 w-full rounded-3xl p-6 flex flex-col items-center justify-center text-center",
    style: {
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      boxShadow: '0 24px 50px -28px rgba(0,0,0,.7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold px-2.5 py-1 rounded-full mb-4",
    style: {
      fontSize: 10,
      background: 'rgba(245,158,11,.15)',
      color: '#f5d061',
      letterSpacing: '0.15em'
    }
  }, "DOMANDA"), /*#__PURE__*/React.createElement("p", {
    className: "font-bold leading-snug",
    style: {
      fontSize: 18,
      color: th.text
    }
  }, card.q), /*#__PURE__*/React.createElement("span", {
    className: "mt-5 flex items-center gap-1.5 fl-mono",
    style: {
      fontSize: 10,
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 11
  }), " TOCCA PER GIRARE")), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 w-full rounded-3xl p-6 flex flex-col",
    style: {
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      background: 'linear-gradient(155deg, rgba(217,119,6,.2), rgba(13,20,38,.95))',
      border: '1px solid rgba(232,185,49,.3)',
      boxShadow: '0 24px 50px -28px rgba(0,0,0,.7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold mb-3",
    style: {
      fontSize: 10,
      color: '#f5d061',
      letterSpacing: '0.15em'
    }
  }, "RISPOSTA"), /*#__PURE__*/React.createElement("p", {
    className: "leading-relaxed flex-1 overflow-y-auto",
    style: {
      fontSize: 15,
      color: '#f8fafc'
    }
  }, card.a)))), flip ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mt-5 fl-fade-up"
  }, RATE.map(rr => /*#__PURE__*/React.createElement("button", {
    key: rr.id,
    onClick: () => rate(rr.id),
    className: "fl-card-hover py-2.5 rounded-xl text-center font-bold",
    style: {
      fontSize: 12,
      backgroundColor: th.card,
      border: `1px solid ${done[idx] === rr.id ? rr.col : th.cardBorder}`,
      color: rr.col
    }
  }, rr.label))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go(-1),
    className: "fl-card-hover fl-glass w-11 h-11 rounded-xl flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20,
    className: "text-amber-400"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDone({});
      setIdx(0);
      setFlip(false);
    },
    className: "fl-mono flex items-center gap-1.5",
    style: {
      fontSize: 11,
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 11
  }), " RESET"), /*#__PURE__*/React.createElement("button", {
    onClick: () => go(1),
    className: "fl-card-hover fl-glass w-11 h-11 rounded-xl flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    size: 20,
    className: "text-amber-400"
  }))));
}

/* ---- QUIZ ---- */
function EqQuiz({
  r,
  th,
  theme,
  onReward,
  rewarded,
  markRewarded
}) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const questions = r.quiz;
  const total = questions.length;
  const q = questions[i];
  const answered = answers[i] !== undefined;
  const score = Object.values(answers).filter(a => a.ok).length;
  const choose = k => {
    if (!answered) setAnswers(p => ({
      ...p,
      [i]: {
        sel: k,
        ok: k === q.correct
      }
    }));
  };
  const restart = () => {
    setI(0);
    setAnswers({});
    setFinished(false);
  };
  const finish = () => {
    setFinished(true);
    const pct = Math.round(score / total * 100);
    if (pct >= 70 && !rewarded.includes(r.key)) {
      onReward(50, 15);
      markRewarded(r.key);
    }
  };
  if (finished) {
    const pct = Math.round(score / total * 100);
    const pass = pct >= 70;
    return /*#__PURE__*/React.createElement("div", {
      className: "fl-glass rounded-3xl p-8 text-center fl-fade-up"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 44
      },
      className: "mb-2"
    }, pass ? '🏆' : '📚'), /*#__PURE__*/React.createElement("div", {
      className: "fl-display fl-gold-text font-bold mb-1",
      style: {
        fontSize: 42
      }
    }, pct, "%"), /*#__PURE__*/React.createElement("p", {
      className: "fl-mono mb-1",
      style: {
        fontSize: 12,
        color: th.textSecondary
      }
    }, score, " / ", total, " CORRETTE"), /*#__PURE__*/React.createElement("h3", {
      className: "font-bold mb-1",
      style: {
        fontSize: 19,
        color: th.text
      }
    }, pass ? 'Sopra la soglia CFA!' : 'Sotto il 70% — ripassa e riprova'), pass && (rewarded.includes(r.key) ? /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: th.textMuted
      }
    }, "Ricompensa gi\xE0 riscossa per questo reading") : /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-amber-400",
      style: {
        fontSize: 13
      }
    }, "+50 XP \xB7 +15 \uD83E\uDE99")), /*#__PURE__*/React.createElement("button", {
      onClick: restart,
      className: "fl-card-hover w-full py-3.5 rounded-2xl font-bold text-white mt-5",
      style: {
        background: 'linear-gradient(110deg,#d97706,#f59e0b)'
      }
    }, "Riprova il quiz"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-x-auto",
    style: {
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-1 py-1",
    style: {
      width: 'max-content'
    }
  }, questions.map((_, k) => {
    const a = answers[k];
    const cur2 = k === i;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      ref: el => {
        if (el && cur2) el.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: 'smooth'
        });
      },
      onClick: () => setI(k),
      className: "flex items-center justify-center rounded-lg font-bold shrink-0 transition-all duration-200",
      style: {
        width: 28,
        height: 28,
        fontSize: 12,
        background: a ? a.ok ? '#10b981' : '#fb7185' : cur2 ? 'linear-gradient(135deg,#fbbf24,#f97316)' : theme === 'dark' ? 'rgba(5,8,16,.6)' : '#e2e8f0',
        color: a || cur2 ? '#fff' : th.textMuted,
        transform: cur2 ? 'scale(1.2)' : 'none',
        boxShadow: cur2 ? '0 3px 10px -2px rgba(245,158,11,.55)' : 'none'
      }
    }, k + 1);
  }))), /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold shrink-0",
    style: {
      fontSize: 11,
      color: '#f5d061'
    }
  }, score, " \u2713")), /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "fl-quiz-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-3xl p-5 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl text-white flex items-center justify-center font-black shrink-0",
    style: {
      width: 34,
      height: 34,
      fontSize: 14,
      background: 'linear-gradient(135deg,#fbbf24,#f97316)'
    }
  }, i + 1), /*#__PURE__*/React.createElement("p", {
    className: "font-bold leading-snug flex-1",
    style: {
      fontSize: 15,
      color: th.text,
      paddingTop: 4
    }
  }, q.q)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, q.opts.map((opt, k) => {
    const isCorrect = k === q.correct;
    const isSel = answers[i]?.sel === k;
    let st = {
      backgroundColor: theme === 'dark' ? 'rgba(5,8,16,.5)' : '#fff',
      border: `1px solid ${th.cardBorder}`,
      color: th.textSecondary
    };
    if (answered) {
      if (isCorrect) st = {
        background: 'rgba(16,185,129,.15)',
        border: '1px solid #10b981',
        color: th.text
      };else if (isSel) st = {
        background: 'rgba(251,113,133,.15)',
        border: '1px solid #fb7185',
        color: th.text
      };else st = {
        ...st,
        opacity: .5
      };
    }
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => choose(k),
      disabled: answered,
      className: `fl-opt-in w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all ${!answered ? 'fl-card-hover' : ''}`,
      style: {
        ...st,
        fontSize: 14,
        animationDelay: `${k * 70}ms`
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "fl-mono rounded-lg flex items-center justify-center font-bold shrink-0",
      style: {
        width: 26,
        height: 26,
        fontSize: 12,
        background: 'rgba(245,158,11,.15)',
        color: '#f5d061'
      }
    }, String.fromCharCode(65 + k)), /*#__PURE__*/React.createElement("span", {
      className: "flex-1"
    }, opt), answered && isCorrect && /*#__PURE__*/React.createElement(Check, {
      size: 18,
      className: "text-emerald-400"
    }), answered && isSel && !isCorrect && /*#__PURE__*/React.createElement(X, {
      size: 18,
      className: "text-rose-400"
    }));
  }))), answered && /*#__PURE__*/React.createElement("div", {
    className: "fl-glass rounded-2xl p-4 mb-3 fl-fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 44,
    mood: answers[i].ok ? 'correct' : 'wrong'
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl-mono font-bold flex items-center gap-1.5 mb-1.5",
    style: {
      fontSize: 10,
      color: '#f5d061',
      letterSpacing: '0.15em'
    }
  }, "\uD83D\uDCA1 SPIEGAZIONE"), /*#__PURE__*/React.createElement("p", {
    className: "leading-relaxed",
    style: {
      fontSize: 13,
      color: th.textSecondary
    }
  }, q.exp))))), answered && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (i < total - 1) setI(i + 1);else finish();
    },
    className: "fl-card-hover w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2",
    style: {
      background: 'linear-gradient(110deg,#d97706,#f59e0b)'
    }
  }, i < total - 1 ? 'Prossima domanda' : 'Vedi risultato', " ", /*#__PURE__*/React.createElement(ChevronRight, {
    size: 18
  })));
}

// ========== FINLEARN CALCULATOR — BA II PLUS-COMPATIBLE (FULL CFA FUNCTION SET) ==========
// Motore sincrono basato su ref (zero stale state) · tasti su pointer-down per reattività immediata
// TVM (P/Y, C/Y, BGN) · AMORT · CF/NPV/IRR · BOND · DEPR · ICONV · DATE · BRKEVN · DATA/STAT · STO/RCL · FORMAT

// ---- Tasto calcolatrice: componente stabile, feedback di pressione in stili inline (funziona anche senza Tailwind JIT) ----
const CALC_KEY_STYLES = {
  num: {
    background: '#e4e4e7',
    color: '#18181b'
  },
  tvm: {
    background: '#3f3f46',
    color: '#ffffff'
  },
  func: {
    background: '#52525b',
    color: '#ffffff'
  },
  op: {
    background: '#3f3f46',
    color: '#fcd34d'
  },
  hot: {
    background: '#f59e0b',
    color: '#18181b',
    fontWeight: 900
  },
  go: {
    background: '#059669',
    color: '#ffffff'
  }
};
function CalcKey({
  main,
  sub,
  kind = 'num',
  onAct
}) {
  const [pressed, setPressed] = useState(false);
  const fired = useRef(false);
  return /*#__PURE__*/React.createElement("button", {
    onPointerDown: e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      fired.current = true;
      setPressed(true);
      onAct();
    },
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    onPointerCancel: () => setPressed(false),
    onClick: () => {
      if (!fired.current) onAct();
      fired.current = false;
    },
    onContextMenu: e => e.preventDefault(),
    className: "relative rounded-lg font-bold select-none",
    style: {
      ...CALC_KEY_STYLES[kind],
      fontSize: 13,
      paddingTop: 14,
      paddingBottom: 7,
      lineHeight: 1.1,
      transform: pressed ? 'scale(0.88)' : 'scale(1)',
      filter: pressed ? 'brightness(1.35)' : 'none',
      transition: 'transform 70ms ease, filter 70ms ease',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      cursor: 'pointer',
      border: 'none'
    }
  }, sub && /*#__PURE__*/React.createElement("span", {
    className: "absolute left-0 right-0 pointer-events-none",
    style: {
      top: 2,
      fontSize: 8,
      fontWeight: 600,
      color: '#fbbf24',
      lineHeight: 1
    }
  }, sub), main);
}
function TICalculator({
  onClose
}) {
  const [, force] = useReducer(c => c + 1, 0);
  const S = useRef({
    display: '0',
    label: '',
    input: '',
    second: false,
    cpt: false,
    ans: 0,
    acc: null,
    op: null,
    memFlag: null,
    ws: null,
    idx: 0,
    pyEdit: false,
    pyField: 'PY',
    tvm: {
      N: 0,
      IY: 0,
      PV: 0,
      PMT: 0,
      FV: 0
    },
    py: 1,
    cy: 1,
    bgn: false,
    cfs: [{
      v: 0,
      f: 1
    }],
    npvI: 0,
    amort: {
      P1: 1,
      P2: 1
    },
    iconv: {
      NOM: 0,
      CY: 12,
      EFF: 0
    },
    brk: {
      FC: 0,
      VC: 0,
      P: 0,
      PFT: 0,
      Q: 0
    },
    depr: {
      M: 'SL',
      DB: 200,
      CST: 0,
      SAL: 0,
      LIF: 1,
      YR: 1
    },
    dateW: {
      DT1: '01.0126',
      DT2: '01.0126',
      DBD: 0,
      ACT: true
    },
    bond: {
      SDT: '01.0126',
      CPN: 0,
      RDT: '01.0131',
      RV: 100,
      ACT: true,
      CPY: 2,
      YLD: 0,
      PRI: 0
    },
    stat: {
      pts: []
    },
    mem: Array(10).fill(0),
    dec: 2
  }).current;
  const R = () => force();

  // ============ HELPERS ============
  const fmt = n => {
    if (n === undefined || n === null || isNaN(n) || !isFinite(n)) return 'Error';
    if (S.dec === 9) {
      if (n !== 0 && (Math.abs(n) < 1e-6 || Math.abs(n) >= 1e10)) return n.toExponential(5);
      return parseFloat(n.toPrecision(10)).toString();
    }
    if (n !== 0 && Math.abs(n) >= 1e10) return n.toExponential(S.dec);
    return n.toLocaleString('en-US', {
      minimumFractionDigits: S.dec,
      maximumFractionDigits: S.dec
    });
  };
  const cur = () => S.input !== '' ? parseFloat(S.input) || 0 : parseFloat(String(S.display).replace(/,/g, '')) || 0;
  const show = (n, lab) => {
    S.display = fmt(n);
    if (!isNaN(n) && isFinite(n)) S.ans = n;
    if (lab !== undefined) S.label = lab;
    S.input = '';
    R();
  };
  const parseDate = s => {
    const str = (parseFloat(s) || 1.0126).toFixed(4);
    const [mm, ddyy] = str.split('.');
    const d = parseInt(ddyy.slice(0, 2)) || 1,
      yy = parseInt(ddyy.slice(2, 4)) || 0;
    const year = yy < 80 ? 2000 + yy : 1900 + yy;
    return new Date(Date.UTC(year, (parseInt(mm) || 1) - 1, d));
  };
  const dateStr = s => {
    const d = parseDate(s);
    return `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}-${d.getUTCFullYear()}`;
  };
  const daysBetween = (a, b, act) => {
    if (act) return Math.round((b - a) / 86400000);
    let y1 = a.getUTCFullYear(),
      m1 = a.getUTCMonth() + 1,
      d1 = Math.min(a.getUTCDate(), 30);
    let y2 = b.getUTCFullYear(),
      m2 = b.getUTCMonth() + 1,
      d2 = b.getUTCDate();
    if (d2 === 31 && d1 === 30) d2 = 30;
    return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
  };

  // ============ TVM ============
  const perRate = iy => {
    const r = iy / 100 / S.cy;
    return Math.pow(1 + r, S.cy / S.py) - 1;
  };
  const tvmF = (i, t) => {
    const g = S.bgn ? 1 + i : 1;
    if (Math.abs(i) < 1e-12) return t.PV + t.PMT * t.N + t.FV;
    return t.PV + t.PMT * g * (1 - Math.pow(1 + i, -t.N)) / i + t.FV * Math.pow(1 + i, -t.N);
  };
  const solveTVM = key => {
    const t = S.tvm,
      i = perRate(t.IY),
      g = S.bgn ? 1 + i : 1;
    if (key === 'FV') return t.FV = Math.abs(i) < 1e-12 ? -(t.PV + t.PMT * t.N) : -(t.PV * Math.pow(1 + i, t.N) + t.PMT * g * (Math.pow(1 + i, t.N) - 1) / i);
    if (key === 'PV') return t.PV = Math.abs(i) < 1e-12 ? -(t.FV + t.PMT * t.N) : -(t.FV * Math.pow(1 + i, -t.N) + t.PMT * g * (1 - Math.pow(1 + i, -t.N)) / i);
    if (key === 'PMT') return t.PMT = Math.abs(i) < 1e-12 ? -(t.PV + t.FV) / t.N : -(t.PV + t.FV * Math.pow(1 + i, -t.N)) / (g * (1 - Math.pow(1 + i, -t.N)) / i);
    if (key === 'N') {
      if (Math.abs(i) < 1e-12) return t.N = -(t.PV + t.FV) / t.PMT;
      const a = -(t.FV * i - t.PMT * g) / (t.PV * i + t.PMT * g);
      return t.N = Math.log(a) / Math.log(1 + i);
    }
    if (key === 'IY') {
      let lo = -0.9999,
        hi = 10,
        fl = tvmF(lo + 1e-9, t);
      if (fl * tvmF(hi, t) > 0) {
        hi = 100;
        if (fl * tvmF(hi, t) > 0) return t.IY = NaN;
      }
      for (let k = 0; k < 200; k++) {
        const m = (lo + hi) / 2,
          fm = tvmF(m, t);
        if (Math.abs(fm) < 1e-10) {
          lo = hi = m;
          break;
        }
        if (fl * fm < 0) hi = m;else {
          lo = m;
          fl = fm;
        }
      }
      const iPer = (lo + hi) / 2;
      return t.IY = (Math.pow(1 + iPer, S.py / S.cy) - 1) * S.cy * 100;
    }
  };

  // ============ CALCOLI WORKSHEET ============
  const calcNPV = () => {
    const r = S.npvI / 100;
    let s = S.cfs[0].v,
      base = 0;
    for (let i = 1; i < S.cfs.length; i++) {
      for (let k = 0; k < S.cfs[i].f; k++) s += S.cfs[i].v / Math.pow(1 + r, base + k + 1);
      base += S.cfs[i].f;
    }
    return s;
  };
  const calcIRR = () => {
    const f = r => {
      let s = S.cfs[0].v,
        base = 0;
      for (let i = 1; i < S.cfs.length; i++) {
        for (let k = 0; k < S.cfs[i].f; k++) s += S.cfs[i].v / Math.pow(1 + r, base + k + 1);
        base += S.cfs[i].f;
      }
      return s;
    };
    let lo = -0.999,
      hi = 10,
      fl = f(lo);
    if (fl * f(hi) > 0) return NaN;
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2,
        fm = f(m);
      if (Math.abs(fm) < 1e-11) return m * 100;
      if (fl * fm < 0) hi = m;else {
        lo = m;
        fl = fm;
      }
    }
    return (lo + hi) / 2 * 100;
  };
  const amortCalc = () => {
    const i = perRate(S.tvm.IY);
    let bal = S.tvm.PV,
      PRN = 0,
      INT = 0;
    const p1 = Math.round(S.amort.P1),
      p2 = Math.round(S.amort.P2);
    for (let p = 1; p <= p2; p++) {
      const interest = bal * i;
      const principal = -S.tvm.PMT - interest;
      if (p >= p1) {
        INT += interest;
        PRN += principal;
      }
      bal -= principal;
    }
    return {
      BAL: bal,
      PRN: -PRN,
      INT: -INT
    };
  };
  const deprCalc = () => {
    const {
      M,
      DB,
      CST,
      SAL,
      LIF,
      YR
    } = S.depr;
    let dep = 0,
      rbv = CST;
    for (let y = 1; y <= Math.min(YR, LIF); y++) {
      let d;
      if (M === 'SL') d = (CST - SAL) / LIF;else if (M === 'SYD') d = (CST - SAL) * (LIF - y + 1) / (LIF * (LIF + 1) / 2);else d = rbv * (DB / 100) / LIF;
      d = Math.max(0, Math.min(d, rbv - SAL));
      if (y === YR) dep = d;
      rbv -= d;
    }
    return {
      DEP: dep,
      RBV: rbv,
      RDV: Math.max(0, rbv - SAL)
    };
  };
  const bondSchedule = () => {
    const settle = parseDate(S.bond.SDT),
      red = parseDate(S.bond.RDT);
    const step = S.bond.CPY === 2 ? 6 : 12;
    const coupons = [];
    let d = new Date(red);
    let guard = 0;
    while (d > settle && guard++ < 600) {
      coupons.unshift(new Date(d));
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - step, d.getUTCDate()));
    }
    return {
      settle,
      coupons,
      prev: d
    };
  };
  const bondPrice = yld => {
    try {
      const {
        settle,
        coupons,
        prev
      } = bondSchedule();
      if (!coupons.length) return {
        clean: NaN,
        ai: NaN
      };
      const c = S.bond.CPN / S.bond.CPY;
      const y = yld / 100 / S.bond.CPY;
      const dPeriod = daysBetween(prev, coupons[0], S.bond.ACT) || 1;
      const w = daysBetween(settle, coupons[0], S.bond.ACT) / dPeriod;
      let dirty = 0;
      coupons.forEach((cd, k) => {
        dirty += (c + (k === coupons.length - 1 ? S.bond.RV : 0)) / Math.pow(1 + y, w + k);
      });
      const ai = c * (1 - w);
      return {
        clean: dirty - ai,
        ai
      };
    } catch {
      return {
        clean: NaN,
        ai: NaN
      };
    }
  };
  const bondSolveYld = () => {
    let lo = -50,
      hi = 300;
    const f = yy => bondPrice(yy).clean - S.bond.PRI;
    let fl = f(lo);
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2,
        fm = f(m);
      if (Math.abs(fm) < 1e-9) return m;
      if (fl * fm < 0) hi = m;else {
        lo = m;
        fl = fm;
      }
    }
    return (lo + hi) / 2;
  };
  const statResults = () => {
    const pts = S.stat.pts.filter(p => p && !isNaN(p.x));
    const n = pts.length;
    if (!n) return [['n', 0]];
    const xs = pts.map(p => p.x),
      ys = pts.map(p => isNaN(p.y) ? 1 : p.y);
    const mx = xs.reduce((a, b) => a + b, 0) / n,
      my = ys.reduce((a, b) => a + b, 0) / n;
    const Sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0),
      Syy = ys.reduce((a, y) => a + (y - my) ** 2, 0);
    const Sxy = pts.reduce((a, p) => a + (p.x - mx) * ((isNaN(p.y) ? 1 : p.y) - my), 0);
    const out = [['n', n], ['x\u0304', mx], ['Sx', Math.sqrt(Sxx / Math.max(1, n - 1))], ['\u03c3x', Math.sqrt(Sxx / n)], ['y\u0304', my], ['Sy', Math.sqrt(Syy / Math.max(1, n - 1))], ['\u03c3y', Math.sqrt(Syy / n)]];
    if (Sxx > 0 && Syy > 0) {
      const b = Sxy / Sxx;
      out.push(['a', my - b * mx], ['b', b], ['r', Sxy / Math.sqrt(Sxx * Syy)]);
    }
    return out;
  };

  // ============ WORKSHEET: campi ============
  const wsFields = name => {
    if (name === 'AMORT') {
      const a = amortCalc();
      return [{
        k: 'P1',
        lab: 'P1',
        get: () => S.amort.P1,
        set: v => S.amort.P1 = Math.max(1, Math.round(v))
      }, {
        k: 'P2',
        lab: 'P2',
        get: () => S.amort.P2,
        set: v => S.amort.P2 = Math.max(1, Math.round(v))
      }, {
        k: 'BAL',
        lab: 'BAL',
        get: () => a.BAL,
        ro: true
      }, {
        k: 'PRN',
        lab: 'PRN',
        get: () => a.PRN,
        ro: true
      }, {
        k: 'INT',
        lab: 'INT',
        get: () => a.INT,
        ro: true
      }];
    }
    if (name === 'ICONV') return [{
      k: 'NOM',
      lab: 'NOM',
      get: () => S.iconv.NOM,
      set: v => S.iconv.NOM = v,
      cpt: () => S.iconv.NOM = (Math.pow(1 + S.iconv.EFF / 100, 1 / S.iconv.CY) - 1) * S.iconv.CY * 100
    }, {
      k: 'EFF',
      lab: 'EFF',
      get: () => S.iconv.EFF,
      set: v => S.iconv.EFF = v,
      cpt: () => S.iconv.EFF = (Math.pow(1 + S.iconv.NOM / 100 / S.iconv.CY, S.iconv.CY) - 1) * 100
    }, {
      k: 'CY',
      lab: 'C/Y',
      get: () => S.iconv.CY,
      set: v => S.iconv.CY = Math.max(1, Math.round(v))
    }];
    if (name === 'BRKEVN') return [{
      k: 'FC',
      lab: 'FC',
      get: () => S.brk.FC,
      set: v => S.brk.FC = v,
      cpt: () => S.brk.FC = (S.brk.P - S.brk.VC) * S.brk.Q - S.brk.PFT
    }, {
      k: 'VC',
      lab: 'VC',
      get: () => S.brk.VC,
      set: v => S.brk.VC = v,
      cpt: () => S.brk.VC = S.brk.P - (S.brk.FC + S.brk.PFT) / S.brk.Q
    }, {
      k: 'P',
      lab: 'P',
      get: () => S.brk.P,
      set: v => S.brk.P = v,
      cpt: () => S.brk.P = S.brk.VC + (S.brk.FC + S.brk.PFT) / S.brk.Q
    }, {
      k: 'PFT',
      lab: 'PFT',
      get: () => S.brk.PFT,
      set: v => S.brk.PFT = v,
      cpt: () => S.brk.PFT = (S.brk.P - S.brk.VC) * S.brk.Q - S.brk.FC
    }, {
      k: 'Q',
      lab: 'Q',
      get: () => S.brk.Q,
      set: v => S.brk.Q = v,
      cpt: () => S.brk.Q = (S.brk.FC + S.brk.PFT) / (S.brk.P - S.brk.VC)
    }];
    if (name === 'DEPR') {
      const d = deprCalc();
      return [{
        k: 'M',
        lab: S.depr.M + (S.depr.M === 'DB' ? ` ${S.depr.DB}%` : ''),
        get: () => ({
          SL: 1,
          SYD: 2,
          DB: 3
        })[S.depr.M],
        setting: true,
        toggle: () => {
          S.depr.M = S.depr.M === 'SL' ? 'SYD' : S.depr.M === 'SYD' ? 'DB' : 'SL';
        }
      }, ...(S.depr.M === 'DB' ? [{
        k: 'DB',
        lab: 'DB%',
        get: () => S.depr.DB,
        set: v => S.depr.DB = v
      }] : []), {
        k: 'CST',
        lab: 'CST',
        get: () => S.depr.CST,
        set: v => S.depr.CST = v
      }, {
        k: 'SAL',
        lab: 'SAL',
        get: () => S.depr.SAL,
        set: v => S.depr.SAL = v
      }, {
        k: 'LIF',
        lab: 'LIF',
        get: () => S.depr.LIF,
        set: v => S.depr.LIF = Math.max(1, Math.round(v))
      }, {
        k: 'YR',
        lab: 'YR',
        get: () => S.depr.YR,
        set: v => S.depr.YR = Math.max(1, Math.round(v))
      }, {
        k: 'DEP',
        lab: 'DEP',
        get: () => d.DEP,
        ro: true
      }, {
        k: 'RBV',
        lab: 'RBV',
        get: () => d.RBV,
        ro: true
      }, {
        k: 'RDV',
        lab: 'RDV',
        get: () => d.RDV,
        ro: true
      }];
    }
    if (name === 'DATE') return [{
      k: 'DT1',
      lab: 'DT1 ' + dateStr(S.dateW.DT1),
      get: () => parseFloat(S.dateW.DT1),
      set: v => S.dateW.DT1 = String(v)
    }, {
      k: 'DT2',
      lab: 'DT2 ' + dateStr(S.dateW.DT2),
      get: () => parseFloat(S.dateW.DT2),
      set: v => S.dateW.DT2 = String(v),
      cpt: () => {
        const d = parseDate(S.dateW.DT1);
        d.setUTCDate(d.getUTCDate() + Math.round(S.dateW.DBD));
        S.dateW.DT2 = `${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCFullYear() % 100).padStart(2, '0')}`;
        return parseFloat(S.dateW.DT2);
      }
    }, {
      k: 'DBD',
      lab: 'DBD',
      get: () => S.dateW.DBD,
      set: v => S.dateW.DBD = v,
      cpt: () => S.dateW.DBD = daysBetween(parseDate(S.dateW.DT1), parseDate(S.dateW.DT2), S.dateW.ACT)
    }, {
      k: 'MODE',
      lab: S.dateW.ACT ? 'ACT' : '360',
      get: () => S.dateW.ACT ? 1 : 2,
      setting: true,
      toggle: () => {
        S.dateW.ACT = !S.dateW.ACT;
      }
    }];
    if (name === 'BOND') return [{
      k: 'SDT',
      lab: 'SDT ' + dateStr(S.bond.SDT),
      get: () => parseFloat(S.bond.SDT),
      set: v => S.bond.SDT = String(v)
    }, {
      k: 'CPN',
      lab: 'CPN',
      get: () => S.bond.CPN,
      set: v => S.bond.CPN = v
    }, {
      k: 'RDT',
      lab: 'RDT ' + dateStr(S.bond.RDT),
      get: () => parseFloat(S.bond.RDT),
      set: v => S.bond.RDT = String(v)
    }, {
      k: 'RV',
      lab: 'RV',
      get: () => S.bond.RV,
      set: v => S.bond.RV = v
    }, {
      k: 'DAY',
      lab: S.bond.ACT ? 'ACT' : '360',
      get: () => S.bond.ACT ? 1 : 2,
      setting: true,
      toggle: () => {
        S.bond.ACT = !S.bond.ACT;
      }
    }, {
      k: 'CPY',
      lab: S.bond.CPY === 2 ? '2/Y' : '1/Y',
      get: () => S.bond.CPY,
      setting: true,
      toggle: () => {
        S.bond.CPY = S.bond.CPY === 2 ? 1 : 2;
      }
    }, {
      k: 'YLD',
      lab: 'YLD',
      get: () => S.bond.YLD,
      set: v => S.bond.YLD = v,
      cpt: () => S.bond.YLD = bondSolveYld()
    }, {
      k: 'PRI',
      lab: 'PRI',
      get: () => S.bond.PRI,
      set: v => S.bond.PRI = v,
      cpt: () => S.bond.PRI = bondPrice(S.bond.YLD).clean
    }, {
      k: 'AI',
      lab: 'AI',
      get: () => bondPrice(S.bond.YLD).ai,
      ro: true
    }];
    if (name === 'MEM') return S.mem.map((m, i) => ({
      k: 'M' + i,
      lab: 'M' + i,
      get: () => S.mem[i],
      set: v => S.mem[i] = v
    }));
    if (name === 'FORMAT') return [{
      k: 'DEC',
      lab: 'DEC',
      get: () => S.dec,
      set: v => S.dec = Math.min(9, Math.max(0, Math.round(v)))
    }];
    return null;
  };
  const wsLen = () => {
    const n = S.ws;
    if (n === 'CF') return 1 + (S.cfs.length - 1) * 2 + 2;
    if (n === 'NPV') return 2;
    if (n === 'DATA') return (S.stat.pts.length + 1) * 2;
    if (n === 'STAT') return statResults().length;
    const f = wsFields(n);
    return f ? f.length : 1;
  };

  // mostra il campo corrente — SINCRONO, legge sempre lo stato fresco dal ref
  const refresh = () => {
    const n = S.ws,
      i = S.idx;
    if (!n) {
      R();
      return;
    }
    if (n === 'CF') {
      if (i === 0) {
        S.label = 'CF0';
        S.display = fmt(S.cfs[0].v);
      } else {
        const ci = Math.ceil(i / 2),
          isF = i % 2 === 0;
        while (S.cfs.length <= ci) S.cfs.push({
          v: 0,
          f: 1
        });
        S.label = (isF ? 'F' : 'C') + String(ci).padStart(2, '0');
        S.display = fmt(isF ? S.cfs[ci].f : S.cfs[ci].v);
      }
    } else if (n === 'NPV') {
      S.label = i === 0 ? 'I' : 'NPV';
      S.display = fmt(i === 0 ? S.npvI : calcNPV());
    } else if (n === 'DATA') {
      const p = Math.floor(i / 2),
        isY = i % 2 === 1;
      while (S.stat.pts.length <= p) S.stat.pts.push({
        x: NaN,
        y: NaN
      });
      S.label = (isY ? 'Y' : 'X') + String(p + 1).padStart(2, '0');
      const pt = S.stat.pts[p];
      S.display = fmt(isY ? isNaN(pt.y) ? 1 : pt.y : isNaN(pt.x) ? 0 : pt.x);
    } else if (n === 'STAT') {
      const res = statResults();
      const [lab, val] = res[Math.min(i, res.length - 1)];
      S.label = lab;
      S.display = fmt(val);
    } else if (n === 'IRR') {/* display già impostato */} else {
      const f = wsFields(n);
      const fl = f[Math.min(i, f.length - 1)];
      S.label = fl.lab;
      S.display = fmt(fl.get());
    }
    S.input = '';
    R();
  };
  const openWs = name => {
    S.ws = name;
    S.idx = 0;
    S.second = false;
    S.cpt = false;
    S.pyEdit = false;
    refresh();
  };
  const move = d => {
    if (S.pyEdit) {
      S.pyField = S.pyField === 'PY' ? 'CY' : 'PY';
      S.label = S.pyField === 'PY' ? 'P/Y' : 'C/Y';
      S.display = fmt(S.pyField === 'PY' ? S.py : S.cy);
      S.input = '';
      R();
      return;
    }
    if (!S.ws || S.ws === 'IRR') return;
    const len = wsLen();
    S.idx = (S.idx + d + len) % len;
    refresh();
  };

  // ============ TASTI ============
  const num = d => {
    if (S.memFlag) {
      const i = parseInt(d);
      if (S.memFlag === 'STO') {
        S.mem[i] = cur();
        S.label = `STO ${i}`;
      } else {
        S.display = fmt(S.mem[i]);
        S.ans = S.mem[i];
        S.label = `RCL ${i}`;
        S.input = '';
      }
      S.memFlag = null;
      R();
      return;
    }
    if (S.second) {
      const map = {
        '7': 'DATA',
        '8': 'STAT',
        '9': 'BOND',
        '4': 'DEPR',
        '5': 'BRKEVN',
        '6': 'ICONV',
        '0': 'MEM'
      };
      if (map[d]) {
        openWs(map[d]);
        return;
      }
      S.second = false;
    }
    S.input = S.input === '0' ? d : S.input + d;
    S.display = S.input;
    R();
  };
  const dot = () => {
    if (S.second) {
      openWs('FORMAT');
      return;
    }
    if (!S.input.includes('.')) {
      S.input = (S.input || '0') + '.';
      S.display = S.input;
      R();
    }
  };
  const plusMinus = () => {
    S.input = S.input !== '' ? S.input.startsWith('-') ? S.input.slice(1) : '-' + S.input : String(-cur());
    S.display = S.input;
    R();
  };
  const back = () => {
    S.input = S.input.slice(0, -1);
    S.display = S.input || '0';
    R();
  };
  const applyOp = (a, b, o) => o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : o === '÷' ? b !== 0 ? a / b : NaN : o === 'yˣ' ? Math.pow(a, b) : b;
  const factorial = n => {
    n = Math.round(n);
    if (n < 0 || n > 170) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };
  const doOp = o => {
    if (S.second) {
      if (o === '×') {
        show(factorial(cur()), 'x!');
        S.second = false;
        R();
        return;
      }
      if (o === '÷') {
        show(Math.random(), 'RAND');
        S.second = false;
        R();
        return;
      }
      S.second = false;
    }
    const v = cur();
    const res = S.acc !== null && S.op ? applyOp(S.acc, v, S.op) : v;
    S.acc = res;
    S.op = o;
    S.display = fmt(res);
    S.label = o;
    S.input = '';
    R();
  };
  const equals = () => {
    if (S.second) {
      show(S.ans, 'ANS');
      S.second = false;
      R();
      return;
    }
    if (S.acc !== null && S.op) {
      const r = applyOp(S.acc, cur(), S.op);
      S.acc = null;
      S.op = null;
      show(r, '');
    }
  };
  const pct = () => {
    if (S.second) {
      openWs('DATE');
      return;
    }
    if (S.acc !== null && S.op) {
      const v = S.acc * cur() / 100;
      S.input = String(v);
      S.display = fmt(v);
      R();
    } else show(cur() / 100, '%');
  };
  const sqrt = () => {
    S.second = false;
    show(Math.sqrt(cur()), '√x');
  };
  const sq = () => {
    S.second = false;
    show(Math.pow(cur(), 2), 'x²');
  };
  const recip = () => {
    S.second = false;
    show(1 / cur(), '1/x');
  };
  const ln = () => {
    if (S.second) {
      S.second = false;
      show(Math.exp(cur()), 'eˣ');
      return;
    }
    show(Math.log(cur()), 'LN');
  };
  const tvmKey = k => {
    if (S.second) {
      S.second = false;
      if (k === 'N') {
        const v = cur() * S.py;
        S.tvm.N = v;
        show(v, 'N');
        return;
      }
      if (k === 'IY') {
        S.pyEdit = true;
        S.ws = null;
        S.pyField = 'PY';
        S.label = 'P/Y';
        S.display = fmt(S.py);
        S.input = '';
        R();
        return;
      }
      if (k === 'PV') {
        openWs('AMORT');
        return;
      }
      if (k === 'PMT') {
        S.bgn = !S.bgn;
        S.label = S.bgn ? 'BGN' : 'END';
        R();
        return;
      }
      if (k === 'FV') {
        S.tvm = {
          N: 0,
          IY: 0,
          PV: 0,
          PMT: 0,
          FV: 0
        };
        S.label = 'CLR TVM';
        S.display = fmt(0);
        S.input = '';
        R();
        return;
      }
    }
    if (S.cpt) {
      S.cpt = false;
      const v = solveTVM(k);
      show(v, k === 'IY' ? 'I/Y' : k);
      return;
    }
    const v = cur();
    S.tvm[k] = v;
    show(v, k === 'IY' ? 'I/Y' : k);
  };
  const pressEnter = () => {
    if (S.pyEdit) {
      const v = Math.max(1, Math.round(cur()));
      if (S.pyField === 'PY') {
        S.py = v;
        S.cy = v;
      } else S.cy = v;
      S.display = fmt(v);
      S.input = '';
      R();
      return;
    }
    if (!S.ws) {
      S.input = '';
      R();
      return;
    }
    const n = S.ws;
    if (n === 'CF') {
      const v = cur();
      if (S.idx === 0) S.cfs[0].v = v;else {
        const ci = Math.ceil(S.idx / 2),
          isF = S.idx % 2 === 0;
        while (S.cfs.length <= ci) S.cfs.push({
          v: 0,
          f: 1
        });
        if (isF) S.cfs[ci].f = Math.max(1, Math.round(v));else S.cfs[ci].v = v;
      }
      refresh();
      return;
    }
    if (n === 'NPV') {
      if (S.idx === 0) S.npvI = cur();
      refresh();
      return;
    }
    if (n === 'DATA') {
      const p = Math.floor(S.idx / 2),
        isY = S.idx % 2 === 1,
        v = cur();
      while (S.stat.pts.length <= p) S.stat.pts.push({
        x: NaN,
        y: NaN
      });
      if (isY) S.stat.pts[p].y = v;else S.stat.pts[p].x = v;
      refresh();
      return;
    }
    if (n === 'STAT' || n === 'IRR') return;
    const fields = wsFields(n);
    if (!fields) return;
    const f = fields[Math.min(S.idx, fields.length - 1)];
    if (f.setting && f.toggle) {
      f.toggle();
      refresh();
      return;
    }
    if (!f.ro && f.set) {
      f.set(cur());
      refresh();
    }
  };
  const cptKey = () => {
    if (S.ws && !['CF', 'DATA', 'STAT', 'IRR'].includes(S.ws)) {
      if (S.ws === 'NPV' && S.idx === 1) {
        show(calcNPV(), 'NPV');
        return;
      }
      const fields = wsFields(S.ws);
      const f = fields?.[Math.min(S.idx, fields.length - 1)];
      if (f?.cpt) {
        const v = f.cpt();
        show(v, f.k);
        return;
      }
    }
    S.cpt = true;
    R();
  };
  const cfKey = () => {
    if (S.second) {
      S.cfs = [{
        v: 0,
        f: 1
      }];
      S.npvI = 0;
      S.second = false;
      S.label = 'CLR WORK';
      if (S.ws === 'CF') {
        S.idx = 0;
        refresh();
      } else R();
      return;
    }
    openWs('CF');
  };
  const irrKey = () => {
    S.cpt = false;
    S.ws = 'IRR';
    S.idx = 0;
    S.label = 'IRR';
    S.display = '...';
    R();
    setTimeout(() => {
      const v = calcIRR();
      S.display = fmt(v);
      if (!isNaN(v)) S.ans = v;
      R();
    }, 20);
  };
  const clear = () => {
    if (S.second) {
      S.ws = null;
      S.pyEdit = false;
      S.label = '';
      S.second = false;
      S.input = '';
      S.display = fmt(S.ans);
      R();
      return;
    } // QUIT
    S.input = '';
    S.display = '0';
    S.acc = null;
    S.op = null;
    S.cpt = false;
    if (S.ws) refresh();else {
      S.label = '';
      R();
    }
  };

  // ============ UI ============

  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3",
    onPointerDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-zinc-900 rounded-3xl p-4 w-full overflow-y-auto shadow-2xl border border-zinc-700",
    style: {
      maxWidth: 380,
      maxHeight: '95vh'
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-amber-400 font-black tracking-widest",
    style: {
      fontSize: 12
    }
  }, "FINLEARN"), /*#__PURE__*/React.createElement("div", {
    className: "text-zinc-500 font-semibold",
    style: {
      fontSize: 10
    }
  }, "Financial Calculator \xB7 BA-compatible")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-7 h-7 rounded-full bg-zinc-700 active:bg-zinc-500 flex items-center justify-center transition-colors"
  }, /*#__PURE__*/React.createElement(X, {
    size: 14,
    className: "text-zinc-300"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-3 mb-3 border-4 border-zinc-800 shadow-inner",
    style: {
      background: '#9aa88a'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between font-bold text-zinc-700",
    style: {
      fontSize: 9,
      height: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, S.second ? '2ND' : ''), /*#__PURE__*/React.createElement("span", null, S.bgn ? 'BGN' : ''), /*#__PURE__*/React.createElement("span", null, S.cpt ? 'CPT' : ''), /*#__PURE__*/React.createElement("span", null, S.ws || (S.pyEdit ? 'P/Y' : '')), /*#__PURE__*/React.createElement("span", null, "DEC ", S.dec === 9 ? 'F' : S.dec)), /*#__PURE__*/React.createElement("div", {
    className: "text-right font-mono text-zinc-700 truncate",
    style: {
      fontSize: 11,
      height: 16
    }
  }, S.label), /*#__PURE__*/React.createElement("div", {
    className: "text-right font-mono font-bold text-zinc-900 truncate",
    style: {
      fontSize: 28,
      lineHeight: 1,
      letterSpacing: '-0.5px'
    }
  }, S.display)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5 gap-1.5"
  }, /*#__PURE__*/React.createElement(CalcKey, {
    main: "2ND",
    kind: S.second ? 'hot' : 'op',
    onAct: () => {
      S.second = !S.second;
      R();
    }
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "CPT",
    kind: "hot",
    onAct: cptKey
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "ENTER",
    sub: "SET",
    kind: "func",
    onAct: pressEnter
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2191",
    sub: "DEL",
    kind: "func",
    onAct: () => move(-1)
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2193",
    sub: "INS",
    kind: "func",
    onAct: () => move(1)
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "CF",
    sub: "CLR WORK",
    kind: "func",
    onAct: cfKey
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "NPV",
    kind: "func",
    onAct: () => openWs('NPV')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "IRR",
    kind: "func",
    onAct: irrKey
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2190",
    kind: "func",
    onAct: back
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "CE|C",
    sub: "QUIT",
    kind: "func",
    onAct: clear
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "N",
    sub: "xP/Y",
    kind: "tvm",
    onAct: () => tvmKey('N')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "I/Y",
    sub: "P/Y",
    kind: "tvm",
    onAct: () => tvmKey('IY')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "PV",
    sub: "AMORT",
    kind: "tvm",
    onAct: () => tvmKey('PV')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "PMT",
    sub: "BGN",
    kind: "tvm",
    onAct: () => tvmKey('PMT')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "FV",
    sub: "CLR TVM",
    kind: "tvm",
    onAct: () => tvmKey('FV')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "%",
    sub: "DATE",
    kind: "func",
    onAct: pct
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u221Ax",
    kind: "func",
    onAct: sqrt
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "x\xB2",
    kind: "func",
    onAct: sq
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "1/x",
    kind: "func",
    onAct: recip
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\xF7",
    sub: "RAND",
    kind: "op",
    onAct: () => doOp('÷')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "STO",
    kind: "func",
    onAct: () => {
      S.memFlag = 'STO';
      R();
    }
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "7",
    sub: "DATA",
    onAct: () => num('7')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "8",
    sub: "STAT",
    onAct: () => num('8')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "9",
    sub: "BOND",
    onAct: () => num('9')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\xD7",
    sub: "x!",
    kind: "op",
    onAct: () => doOp('×')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "RCL",
    kind: "func",
    onAct: () => {
      S.memFlag = 'RCL';
      R();
    }
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "4",
    sub: "DEPR",
    onAct: () => num('4')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "5",
    sub: "BRKEVN",
    onAct: () => num('5')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "6",
    sub: "ICONV",
    onAct: () => num('6')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "\u2212",
    kind: "op",
    onAct: () => doOp('−')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "LN",
    sub: "e\u02E3",
    kind: "func",
    onAct: ln
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "1",
    onAct: () => num('1')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "2",
    onAct: () => num('2')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "3",
    onAct: () => num('3')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "+",
    kind: "op",
    onAct: () => doOp('+')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "y\u02E3",
    kind: "func",
    onAct: () => doOp('yˣ')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "0",
    sub: "MEM",
    onAct: () => num('0')
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: ".",
    sub: "FORMAT",
    onAct: dot
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "+/\u2212",
    onAct: plusMinus
  }), /*#__PURE__*/React.createElement(CalcKey, {
    main: "=",
    sub: "ANS",
    kind: "go",
    onAct: equals
  })), S.memFlag && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-center text-amber-400 font-bold",
    style: {
      fontSize: 10
    }
  }, S.memFlag, ": premi una cifra (0\\u20139)"), /*#__PURE__*/React.createElement("div", {
    className: "mt-2.5 text-zinc-500 text-center",
    style: {
      fontSize: 9,
      lineHeight: 1.5
    }
  }, "TVM: valore\u2192tasto \xB7 CPT\u2192tasto per calcolare \xB7 2ND I/Y = P/Y (\u2191\u2193 per C/Y) \xB7 2ND PMT = BGN", /*#__PURE__*/React.createElement("br", null), "Worksheet (2ND + cifra): DATA\xB7STAT\xB7BOND\xB7DEPR\xB7BRKEVN\xB7ICONV\xB7MEM | 2ND % = DATE | \u2191\u2193 naviga \xB7 ENTER salva \xB7 ENTER sui setting = cambia \xB7 2ND CE|C esce", /*#__PURE__*/React.createElement("br", null), "Date in formato MM.DDYY (es. 06.1526 = 15 giu 2026)")));
}

// ========== AI ON-DEVICE: modello locale nel browser (transformers.js, zero config) ==========
let _devicePipePromise = null;
function loadDeviceModel(onProgress) {
  if (!_devicePipePromise) {
    _devicePipePromise = (async () => {
      const {
        pipeline
      } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.1');
      const device = typeof navigator !== 'undefined' && navigator.gpu ? 'webgpu' : 'wasm';
      return pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
        dtype: 'q4',
        device,
        progress_callback: p => {
          if (p.status === 'progress' && p.total) onProgress?.(Math.min(99, Math.round(p.loaded / p.total * 100)), p.file || '');
          if (p.status === 'done') onProgress?.(100, p.file || '');
        }
      });
    })().catch(e => {
      _devicePipePromise = null;
      throw e;
    });
  }
  return _devicePipePromise;
}

// ========== AI CHAT MODAL WITH REAL ANTHROPIC API ==========
function AiChatModal({
  onClose,
  chatId,
  chats,
  setChats,
  currentQuestion
}) {
  const [msg, setMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  // ---- motore AI: 'claude' (integrato) oppure 'ollama' (modello locale sul tuo computer) ----
  const [engine, setEngine] = useState('claude');
  const [showCfg, setShowCfg] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('idle'); // idle | loading | ready | error
  const [deviceProgress, setDeviceProgress] = useState(0);
  const [deviceFile, setDeviceFile] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.1:8b');
  const chatEndRef = useRef(null);

  // Deriva chat corrente da chats
  const currentChat = chats.find(c => c.id === chatId);
  const chat = currentChat?.messages || [];
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chat, typing]);

  // System prompt per il tutor CFA
  const getSystemPrompt = () => {
    let prompt = `Sei FinLearn AI Coach 🐂, un tutor esperto per la preparazione all'esame CFA Level 1.

REGOLE FONDAMENTALI:
- Rispondi SEMPRE in italiano
- Sii conciso ma esaustivo (max 150 parole per risposta)
- Usa emoji per rendere le spiegazioni più engaging
- Se l'utente chiede aiuto su una domanda, NON dare la risposta diretta
- Guida il ragionamento con domande socratiche
- Usa esempi pratici e mnemonici

TONO:
- Incoraggiante ma professionale
- Usa "tu" informale
- Celebra i progressi dell'utente

FORMATO:
- Usa bullet points per liste
- Evidenzia formule importanti
- Includi mnemonici quando utili`;
    if (currentQuestion) {
      prompt += `

CONTESTO DOMANDA ATTUALE:
Domanda: "${currentQuestion.q}"
Opzioni: ${currentQuestion.opts.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join(', ')}
Topic: ${currentQuestion.topic || 'Fixed Income'}

IMPORTANTE: Se l'utente chiede aiuto su questa domanda, guida il ragionamento senza rivelare la risposta. Puoi spiegare i concetti teorici correlati.`;
    }
    return prompt;
  };

  // Chiamata API Anthropic reale
  const callAnthropicAPI = async (userMessage, conversationHistory) => {
    try {
      // Costruisci la history per l'API
      const messages = conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
        role: m.role,
        content: m.content
      }));

      // Aggiungi il nuovo messaggio
      messages.push({
        role: 'user',
        content: userMessage
      });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: getSystemPrompt(),
          messages: messages
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }
      const data = await response.json();

      // Estrai il testo dalla risposta
      const assistantMessage = data.content.filter(block => block.type === 'text').map(block => block.text).join('\n');
      return assistantMessage || 'Mi dispiace, non ho ricevuto una risposta valida.';
    } catch (err) {
      console.error('Anthropic API Error:', err);
      throw err;
    }
  };

  // Chiamata a modello LOCALE via Ollama (https://ollama.com) — gira sul tuo computer
  const callOllamaAPI = async (userMessage, conversationHistory) => {
    const messages = [{
      role: 'system',
      content: getSystemPrompt()
    }, ...conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
      role: m.role,
      content: m.content
    })), {
      role: 'user',
      content: userMessage
    }];
    const response = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages,
        stream: false,
        options: {
          num_predict: 500
        }
      })
    });
    if (!response.ok) {
      const t = await response.text().catch(() => '');
      throw new Error(`Ollama ${response.status}: ${t.slice(0, 120)}`);
    }
    const data = await response.json();
    return data.message?.content || 'Risposta vuota dal modello locale.';
  };

  // Generazione ON-DEVICE: il modello gira dentro il browser, nessun server
  const callDeviceAPI = async (userMessage, conversationHistory) => {
    if (deviceStatus !== 'ready') setDeviceStatus('loading');
    const pipe = await loadDeviceModel((pct, file) => {
      setDeviceProgress(pct);
      setDeviceFile(file);
    });
    setDeviceStatus('ready');
    const messages = [{
      role: 'system',
      content: getSystemPrompt() + '\nRispondi in modo breve (max 80 parole).'
    }, ...conversationHistory.slice(-6).filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
      role: m.role,
      content: m.content
    })), {
      role: 'user',
      content: userMessage
    }];
    const out = await pipe(messages, {
      max_new_tokens: 220,
      temperature: 0.7,
      do_sample: true
    });
    const gen = out?.[0]?.generated_text;
    const last = Array.isArray(gen) ? gen[gen.length - 1]?.content : String(gen || '');
    return last || 'Risposta vuota dal modello on-device.';
  };
  const sendMsg = async () => {
    if (!msg.trim() || typing) return;
    const userMessage = {
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString()
    };

    // Aggiungi messaggio utente a chats
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
    const currentMsg = msg;
    const currentHistory = [...chat];
    setMsg('');
    setTyping(true);
    setError(null);
    try {
      const aiResponse = engine === 'ollama' ? await callOllamaAPI(currentMsg, currentHistory) : engine === 'device' ? await callDeviceAPI(currentMsg, currentHistory) : await callAnthropicAPI(currentMsg, currentHistory);

      // Aggiungi risposta AI a chats
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: [...c.messages, {
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));
    } catch (err) {
      if (engine === 'device') setDeviceStatus('error');
      setError(engine === 'device' ? "Il modello on-device non si è caricato. Nell'anteprima di claude.ai il download è bloccato dalla sandbox: usa questo motore nella versione pubblicata (PWA/GitHub Pages), oppure resta su Claude." : engine === 'ollama' ? `Non raggiungo Ollama su ${ollamaUrl}. Verifica che sia avviato (\`ollama serve\`) e lanciato con OLLAMA_ORIGINS="*", e che il modello \`${ollamaModel}\` sia scaricato (\`ollama pull ${ollamaModel}\`).` : 'Errore di connessione al motore Claude. Riprova.');
      console.error('Chat error:', err);
    } finally {
      setTyping(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/50 z-50 flex items-end justify-center",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white w-full max-w-xl rounded-t-3xl flex flex-col animate-slide-up",
    style: {
      height: '75vh'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between p-4 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83D\uDC02"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-slate-800"
  }, "AI Coach"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-600 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
  }), engine === 'ollama' ? `Ollama · ${ollamaModel}` : engine === 'device' ? `On-device · Qwen2.5-0.5B ${deviceStatus === 'ready' ? '· pronto' : ''}` : 'Claude (integrato)'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex rounded-full bg-slate-100 p-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setEngine('claude'),
    className: `px-2.5 py-1 rounded-full font-bold transition ${engine === 'claude' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`,
    style: {
      fontSize: 11
    }
  }, "Claude"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEngine('device'),
    className: `px-2.5 py-1 rounded-full font-bold transition ${engine === 'device' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`,
    style: {
      fontSize: 11
    }
  }, "On-device"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEngine('ollama');
      setShowCfg(true);
    },
    className: `px-2.5 py-1 rounded-full font-bold transition ${engine === 'ollama' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`,
    style: {
      fontSize: 11
    }
  }, "Ollama")), engine === 'ollama' && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowCfg(s => !s),
    className: "p-1.5 hover:bg-slate-100 rounded-full",
    title: "Configura Ollama"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\u2699\uFE0F")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "p-2 hover:bg-slate-100 rounded-full"
  }, /*#__PURE__*/React.createElement(X, {
    size: 24,
    className: "text-slate-600"
  })))), engine === 'ollama' && showCfg && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-500 mb-0.5",
    style: {
      fontSize: 10
    }
  }, "URL OLLAMA"), /*#__PURE__*/React.createElement("input", {
    value: ollamaUrl,
    onChange: e => setOllamaUrl(e.target.value),
    className: "w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700",
    style: {
      fontSize: 12
    },
    placeholder: "http://localhost:11434"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-500 mb-0.5",
    style: {
      fontSize: 10
    }
  }, "MODELLO"), /*#__PURE__*/React.createElement("input", {
    value: ollamaModel,
    onChange: e => setOllamaModel(e.target.value),
    className: "w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700",
    style: {
      fontSize: 12
    },
    placeholder: "llama3.1:8b"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 leading-snug",
    style: {
      fontSize: 10
    }
  }, "Sul computer: installa Ollama, poi ", /*#__PURE__*/React.createElement("code", {
    className: "bg-slate-200 px-1 rounded"
  }, "OLLAMA_ORIGINS=\"*\" ollama serve"), " e ", /*#__PURE__*/React.createElement("code", {
    className: "bg-slate-200 px-1 rounded"
  }, "ollama pull ", ollamaModel || 'llama3.1:8b'), ". Da iPhone usa l'IP del computer (es. http://192.168.1.10:11434).")), engine === 'device' && deviceStatus !== 'ready' && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 bg-slate-50 border-b border-slate-200"
  }, deviceStatus === 'loading' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-600",
    style: {
      fontSize: 11
    }
  }, "Scarico il modello (solo la prima volta)\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-amber-600",
    style: {
      fontSize: 11
    }
  }, deviceProgress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-1.5 rounded-full bg-slate-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all",
    style: {
      width: `${deviceProgress}%`
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 truncate mt-1",
    style: {
      fontSize: 9
    }
  }, deviceFile)) : /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-snug",
    style: {
      fontSize: 11
    }
  }, "\uD83E\uDDE0 Modello ", /*#__PURE__*/React.createElement("b", null, "Qwen2.5-0.5B"), " eseguito ", /*#__PURE__*/React.createElement("b", null, "dentro il browser"), " (WebGPU/WASM): nessuna installazione, nessuna chiave. ~350MB scaricati una sola volta al primo messaggio, poi resta in cache e funziona anche offline. Qualit\xE0 da mini-modello: ottimo per hint e definizioni rapide.")), currentQuestion && /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2 bg-amber-50 border-b border-amber-100"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-amber-700 font-medium truncate"
  }, "\uD83D\uDCDD Domanda: ", currentQuestion.q.substring(0, 60), "...")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-4 space-y-3"
  }, chat.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl mb-4"
  }, "\uD83D\uDC02"), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800 mb-2"
  }, "Ciao! Sono il tuo AI Coach"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm mb-4"
  }, "Posso aiutarti a capire i concetti senza darti le risposte dirette."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-center gap-2"
  }, ['Spiegami il concetto', 'Dammi un hint', 'Non capisco'].map(suggestion => /*#__PURE__*/React.createElement("button", {
    key: suggestion,
    onClick: () => setMsg(suggestion),
    className: "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 transition"
  }, suggestion)))), chat.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-[85%] rounded-2xl p-3 ${m.role === 'user' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "whitespace-pre-wrap"
  }, m.content)))), typing && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-100 rounded-2xl p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.1s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.2s'
    }
  })))), error && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-rose-50 text-rose-600 rounded-xl px-4 py-2 text-sm"
  }, "\u26A0\uFE0F ", error)), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: msg,
    onChange: e => setMsg(e.target.value),
    onKeyDown: e => e.key === 'Enter' && !e.shiftKey && sendMsg(),
    placeholder: "Chiedimi qualcosa...",
    disabled: typing,
    className: "flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 disabled:bg-slate-50"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendMsg,
    disabled: !msg.trim() || typing,
    className: "px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
  }, /*#__PURE__*/React.createElement(Send, {
    size: 20
  }))))));
}

// ========== PRO UPGRADE MODAL ==========
function ProModal({
  onClose,
  onUpgrade
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 text-white text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl mb-3"
  }, "\uD83D\uDC51"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-black"
  }, "FinLearn PRO"), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 mt-1"
  }, "Sblocca tutto il potenziale")), /*#__PURE__*/React.createElement("div", {
    className: "p-6 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83D\uDCDD"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "Mock Exam Completi"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "180 domande, 3 ore, identico all'esame CFA reale"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "+500 XP per Mock"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "Domina la classifica e diventa #1"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "Analytics Avanzati"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "Scopri i tuoi punti deboli e migliorali"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl"
  }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-800"
  }, "AI Coach Illimitato"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-sm"
  }, "Chiedi tutto quello che vuoi, sempre")))), /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-sm line-through"
  }, "\u20AC39.99/mese"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-black text-slate-800"
  }, "\u20AC19.99", /*#__PURE__*/React.createElement("span", {
    className: "text-base font-normal text-slate-500"
  }, "/mese"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full"
  }, "-50%")), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-700 text-xs mt-2"
  }, "\uD83D\uDD25 Offerta limitata per i primi 100 utenti")), /*#__PURE__*/React.createElement("button", {
    onClick: onUpgrade,
    className: "w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 text-lg"
  }, "SBLOCCA PRO \uD83D\uDC51"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-3 text-slate-500 font-medium mt-2 hover:text-slate-700 transition"
  }, "Magari dopo"))));
}

// ========== MAIN APP (requires auth) ==========
function MainApp({
  user,
  userData,
  onLogout,
  onSaveProgress
}) {
  const [section, setSection] = useState('home');
  const [showCalc, setShowCalc] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [completed, setCompleted] = useState(userData?.completedLessons || []);
  const [activeLesson, setActiveLesson] = useState(userData?.activeLesson || 1);
  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [topic, setTopic] = useState(null);
  const [tab, setTab] = useState('theory');
  const [cardIdx, setCardIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timerOn, setTimerOn] = useState(userData?.settings?.timerEnabled || false);
  const [timer, setTimer] = useState(null);

  // CFA Curriculum states
  const [studyMode, setStudyMode] = useState('curriculum');
  const [cfaTopic, setCfaTopic] = useState(null);
  const [cfaModule, setCfaModule] = useState(null);
  const [cfaLOS, setCfaLOS] = useState(null);
  const [expandedSection, setExpandedSection] = useState(0);
  const [losProgress, setLosProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('finlearn_los_progress') || '[]');
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('finlearn_los_progress', JSON.stringify(losProgress));
  }, [losProgress]);

  // Theme state con persistenza
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('finlearn_theme');
      return saved || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Salva theme quando cambia
  useEffect(() => {
    localStorage.setItem('finlearn_theme', theme);
  }, [theme]);

  // Theme colors helper
  const th = theme === 'dark' ? {
    bg: '#070b14',
    bgSecondary: '#0b1322',
    card: 'rgba(13, 20, 38, 0.7)',
    cardBorder: 'rgba(232, 185, 49, 0.14)',
    text: '#f8fafc',
    textMuted: '#7c89a3',
    textSecondary: '#b8c2d6',
    inputBg: 'rgba(5, 8, 16, 0.5)',
    inputBorder: 'rgba(232, 185, 49, 0.16)',
    navBg: 'rgba(7, 11, 20, 0.85)',
    navBorder: 'rgba(232, 185, 49, 0.12)',
    overlay: 'rgba(4, 6, 13, 0.9)',
    chatBubbleAi: 'rgba(13, 20, 38, 0.8)',
    chatBubbleUser: '#f59e0b'
  } : {
    bg: '#f8fafc',
    bgSecondary: '#ffffff',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    textSecondary: '#475569',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    navBg: '#ffffff',
    navBorder: '#e2e8f0',
    overlay: 'rgba(255, 255, 255, 0.95)',
    chatBubbleAi: '#ffffff',
    chatBubbleUser: '#f59e0b'
  };

  // Chat history system - replaces simple chat state
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem(`finlearn_chats_${user?.uid || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [msg, setMsg] = useState('');
  const [typing, setTyping] = useState(false);

  // Derived state - current chat messages
  const currentChat = chats.find(c => c.id === activeChatId);
  const chat = currentChat?.messages || [];
  const [stats, setStats] = useState(userData?.stats || {
    streak: 0,
    coins: 0,
    level: 1,
    xp: 0,
    quizzes: 0,
    correct: 0,
    cards: 0
  });
  const [eqOpen, setEqOpen] = useState(false);
  const [eqRewarded, setEqRewarded] = useState([]);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); // Track all answers: { index: { selected, isCorrect } }
  const [showQuizChat, setShowQuizChat] = useState(false);
  const [quizChatId, setQuizChatId] = useState(null); // ID della chat quiz attiva (usa sistema chats unificato)

  // ========== MOCK EXAM AI SYSTEM ==========
  const [mockExamState, setMockExamState] = useState({
    active: false,
    loading: false,
    questions: [],
    currentIndex: 0,
    answers: [],
    timeRemaining: 0,
    sessionTopic: null,
    examConfig: null,
    results: null,
    error: null,
    flagged: [],
    isFullExam: false
  });

  // CFA Topics per Mock Exam
  const CFA_TOPICS = [{
    id: 'ethics',
    name: 'Ethics & Professional Standards',
    weight: 15,
    icon: '⚖️'
  }, {
    id: 'quant',
    name: 'Quantitative Methods',
    weight: 10,
    icon: '📊'
  }, {
    id: 'economics',
    name: 'Economics',
    weight: 10,
    icon: '🌐'
  }, {
    id: 'fra',
    name: 'Financial Reporting & Analysis',
    weight: 15,
    icon: '📈'
  }, {
    id: 'corporate',
    name: 'Corporate Issuers',
    weight: 10,
    icon: '🏢'
  }, {
    id: 'equity',
    name: 'Equity Investments',
    weight: 11,
    icon: '📉'
  }, {
    id: 'fixed',
    name: 'Fixed Income',
    weight: 11,
    icon: '💵'
  }, {
    id: 'derivatives',
    name: 'Derivatives',
    weight: 6,
    icon: '🔄'
  }, {
    id: 'alternatives',
    name: 'Alternative Investments',
    weight: 6,
    icon: '🏠'
  }, {
    id: 'portfolio',
    name: 'Portfolio Management',
    weight: 6,
    icon: '💼'
  }];

  // Mock Exam Setup State
  const [showMockExamSetup, setShowMockExamSetup] = useState(false);
  const [mockExamConfig, setMockExamConfig] = useState({
    numQuestions: 10,
    timeLimit: 15,
    selectedTopics: [{
      id: 'ethics',
      name: 'Ethics & Professional Standards',
      weight: 15,
      icon: '⚖️'
    }, {
      id: 'fixed',
      name: 'Fixed Income',
      weight: 11,
      icon: '💵'
    }, {
      id: 'equity',
      name: 'Equity Investments',
      weight: 11,
      icon: '📉'
    }],
    difficulty: 2
  });

  // Generate questions via AI
  const generateMockQuestions = async config => {
    const {
      numQuestions,
      topics,
      difficulty
    } = config;

    // Build prompt for Claude
    const topicsList = topics.map(t => t.name).join(', ');
    const prompt = `You are a CFA Level 1 exam question generator. Generate ${numQuestions} multiple choice questions.

REQUIREMENTS:
- Topics to cover: ${topicsList}
- Difficulty: ${difficulty} (1=easy, 2=medium, 3=hard)
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Include calculations where appropriate
- Questions should match real CFA exam style and difficulty

RESPOND ONLY WITH A VALID JSON ARRAY, no other text:
[
  {
    "topic": "Fixed Income",
    "q": "A bond has a coupon rate of 6% and currently trades at 95. What is the current yield?",
    "opts": ["5.68%", "6.00%", "6.32%", "6.67%"],
    "ans": 2,
    "exp": "Current Yield = Annual Coupon / Current Price = 6/95 = 6.32%. The current yield is higher than the coupon rate because the bond trades at a discount."
  }
]

Generate exactly ${numQuestions} questions now:`;
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });
      const data = await response.json();
      const content = data.content?.[0]?.text || '';

      // Parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Invalid response format');
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (err) {
      console.error('Error generating questions:', err);
      throw err;
    }
  };

  // ========== FULL EXAM CONFIG ==========
  const CFA_FULL_EXAM_CONFIG = {
    totalQuestions: 180,
    timeMinutes: 270,
    passingScore: 70,
    distribution: {
      ethics: 33,
      fra: 25,
      equity: 20,
      fixed: 20,
      quant: 16,
      economics: 16,
      portfolio: 14,
      alternatives: 13,
      corporate: 12,
      derivatives: 11
    }
  };

  // ========== PRE-BUILT CFA QUESTION BANK ==========
  const CFA_QUESTION_BANK = {
    ethics: [{
      topic: "Ethics",
      q: "According to the CFA Institute Code of Ethics, members must place the integrity of the investment profession and the interests of clients above:",
      opts: ["Their own personal interests", "The interests of their employer", "Both A and B", "Neither A nor B"],
      ans: 2,
      exp: "The Code of Ethics requires members to place client interests and professional integrity above both personal interests and employer interests."
    }, {
      topic: "Ethics",
      q: "A CFA charterholder receives material nonpublic information about a company. According to Standard II(A), which action is most appropriate?",
      opts: ["Trade immediately before the information becomes public", "Share the information only with preferred clients", "Refrain from trading until the information is public", "Trade in small amounts to avoid detection"],
      ans: 2,
      exp: "Standard II(A) Material Nonpublic Information prohibits trading on or causing others to trade on material nonpublic information."
    }, {
      topic: "Ethics",
      q: "Which of the following best describes the fiduciary duty of a portfolio manager?",
      opts: ["Maximizing returns regardless of risk", "Acting in the best interest of the client", "Following all client instructions without question", "Minimizing taxes at all costs"],
      ans: 1,
      exp: "Fiduciary duty requires acting in the client's best interest, which includes considering risk tolerance, investment objectives, and suitability."
    }, {
      topic: "Ethics",
      q: "Standard III(B) Fair Dealing requires investment recommendations to be:",
      opts: ["Given first to the largest clients", "Disseminated fairly to all clients", "Shared only with institutional clients", "Provided based on commission levels"],
      ans: 1,
      exp: "Fair Dealing requires that investment recommendations and actions be disseminated to all clients in a fair manner, without favoring any client over another."
    }, {
      topic: "Ethics",
      q: "A research analyst owns shares in a company she covers. According to CFA Standards, she must:",
      opts: ["Sell all shares immediately", "Disclose the ownership in research reports", "Stop covering the company", "Transfer shares to a family member"],
      ans: 1,
      exp: "Standard VI(A) requires disclosure of conflicts of interest, including beneficial ownership of securities being recommended."
    }],
    fixed: [{
      topic: "Fixed Income",
      q: "A bond with a 5% coupon rate is trading at 102. The current yield is closest to:",
      opts: ["4.90%", "5.00%", "5.10%", "4.80%"],
      ans: 0,
      exp: "Current Yield = Annual Coupon / Price = 5/102 = 4.90%. When a bond trades at a premium, current yield is less than coupon rate."
    }, {
      topic: "Fixed Income",
      q: "Which of the following bonds has the highest interest rate risk?",
      opts: ["5-year, 8% coupon", "10-year, 8% coupon", "10-year, 4% coupon", "5-year, 4% coupon"],
      ans: 2,
      exp: "Interest rate risk increases with longer maturity and lower coupon rates. The 10-year, 4% coupon bond has both characteristics."
    }, {
      topic: "Fixed Income",
      q: "Macaulay duration of a zero-coupon bond equals:",
      opts: ["Zero", "Half its maturity", "Its maturity", "Twice its maturity"],
      ans: 2,
      exp: "For a zero-coupon bond, Macaulay duration equals its time to maturity because all cash flows occur at maturity."
    }, {
      topic: "Fixed Income",
      q: "If interest rates increase by 100 basis points, a bond with modified duration of 7 will change in price by approximately:",
      opts: ["+7%", "-7%", "+0.7%", "-0.7%"],
      ans: 1,
      exp: "Price change ≈ -Modified Duration × ΔYield = -7 × 0.01 = -7%. Bond prices move inversely to interest rates."
    }, {
      topic: "Fixed Income",
      q: "A callable bond compared to an otherwise identical non-callable bond will have:",
      opts: ["Higher price", "Lower yield", "Negative convexity at low yields", "Higher duration"],
      ans: 2,
      exp: "Callable bonds exhibit negative convexity when yields are low because the call option limits price appreciation."
    }, {
      topic: "Fixed Income",
      q: "The Z-spread is the spread that when added to each spot rate on the benchmark curve makes the present value of the bond's cash flows equal to its:",
      opts: ["Par value", "Face value", "Market price", "Coupon payment"],
      ans: 2,
      exp: "The Z-spread (zero-volatility spread) is the constant spread added to Treasury spot rates to discount a bond's cash flows to its market price."
    }, {
      topic: "Fixed Income",
      q: "Which bond type has the least reinvestment risk?",
      opts: ["Coupon bond", "Zero-coupon bond", "Floating rate bond", "Callable bond"],
      ans: 1,
      exp: "Zero-coupon bonds have no reinvestment risk because there are no periodic coupon payments to reinvest."
    }],
    equity: [{
      topic: "Equity",
      q: "A company has a P/E ratio of 15 and earnings per share of $4. The stock price is:",
      opts: ["$45", "$60", "$75", "$30"],
      ans: 1,
      exp: "Stock Price = P/E × EPS = 15 × $4 = $60"
    }, {
      topic: "Equity",
      q: "The dividend discount model (DDM) is most appropriate for valuing:",
      opts: ["High-growth technology companies", "Mature dividend-paying companies", "Companies with negative earnings", "Start-up companies"],
      ans: 1,
      exp: "DDM works best for mature companies with stable, predictable dividends."
    }, {
      topic: "Equity",
      q: "If a stock has a beta of 1.5 and the market rises by 10%, the stock is expected to:",
      opts: ["Rise by 10%", "Rise by 15%", "Rise by 5%", "Fall by 15%"],
      ans: 1,
      exp: "Beta measures systematic risk. Expected return = Beta × Market Return = 1.5 × 10% = 15%."
    }, {
      topic: "Equity",
      q: "A stock trading at $50 with expected dividend of $2 and growth rate of 6%. Using Gordon Growth Model, required return is:",
      opts: ["8%", "10%", "12%", "6%"],
      ans: 1,
      exp: "r = (D1/P0) + g = (2/50) + 0.06 = 0.04 + 0.06 = 10%"
    }, {
      topic: "Equity",
      q: "Which ratio measures operational efficiency?",
      opts: ["Current ratio", "Debt-to-equity", "Asset turnover", "Price-to-book"],
      ans: 2,
      exp: "Asset turnover (Revenue/Total Assets) measures how efficiently a company uses its assets to generate sales."
    }, {
      topic: "Equity",
      q: "Free Cash Flow to Equity (FCFE) equals:",
      opts: ["CFO - CapEx", "CFO - CapEx + Net Borrowing", "Net Income + Depreciation", "EBITDA - Taxes"],
      ans: 1,
      exp: "FCFE = CFO - Capital Expenditures + Net Borrowing. It represents cash available to equity holders."
    }],
    quant: [{
      topic: "Quantitative Methods",
      q: "An investment of $1,000 grows to $1,610.51 over 5 years. The compound annual growth rate is closest to:",
      opts: ["8%", "10%", "12%", "15%"],
      ans: 1,
      exp: "CAGR = (FV/PV)^(1/n) - 1 = (1610.51/1000)^(1/5) - 1 = 10%"
    }, {
      topic: "Quantitative Methods",
      q: "A 95% confidence interval means:",
      opts: ["95% of data falls within the interval", "There's 95% probability the true parameter is in the interval", "The test has 95% power", "5% of samples will be outliers"],
      ans: 1,
      exp: "A 95% confidence interval means we are 95% confident that the true population parameter lies within the interval."
    }, {
      topic: "Quantitative Methods",
      q: "The coefficient of variation (CV) is calculated as:",
      opts: ["Mean / Standard Deviation", "Standard Deviation / Mean", "Variance / Mean", "Mean / Variance"],
      ans: 1,
      exp: "CV = Standard Deviation / Mean. It measures relative dispersion and allows comparison across different scales."
    }, {
      topic: "Quantitative Methods",
      q: "NPV of a project is $50,000 and IRR is 15%. If cost of capital is 12%, you should:",
      opts: ["Reject - NPV is too low", "Accept - positive NPV and IRR > cost of capital", "Reject - IRR is too high", "Need more information"],
      ans: 1,
      exp: "Accept because NPV > 0 and IRR (15%) > Cost of Capital (12%). Both criteria indicate value creation."
    }, {
      topic: "Quantitative Methods",
      q: "In a normal distribution, approximately what percentage of observations fall within ±2 standard deviations?",
      opts: ["68%", "95%", "99%", "90%"],
      ans: 1,
      exp: "For a normal distribution: ±1σ = 68%, ±2σ = 95%, ±3σ = 99.7%"
    }],
    economics: [{
      topic: "Economics",
      q: "If a country's currency depreciates, its exports will likely:",
      opts: ["Decrease", "Increase", "Stay the same", "Become more expensive"],
      ans: 1,
      exp: "Currency depreciation makes exports cheaper for foreign buyers, increasing export demand."
    }, {
      topic: "Economics",
      q: "The Phillips Curve shows the relationship between:",
      opts: ["GDP and interest rates", "Inflation and unemployment", "Supply and demand", "Savings and investment"],
      ans: 1,
      exp: "The Phillips Curve illustrates the inverse relationship between inflation and unemployment in the short run."
    }, {
      topic: "Economics",
      q: "Expansionary monetary policy typically leads to:",
      opts: ["Higher interest rates", "Lower money supply", "Increased borrowing and spending", "Currency appreciation"],
      ans: 2,
      exp: "Expansionary monetary policy lowers interest rates, encouraging borrowing and spending to stimulate the economy."
    }, {
      topic: "Economics",
      q: "GDP calculated using the expenditure approach equals:",
      opts: ["C + I + G + NX", "Wages + Rent + Interest + Profits", "Total output × Price level", "Income - Taxes + Transfers"],
      ans: 0,
      exp: "GDP (Expenditure) = Consumption + Investment + Government Spending + Net Exports (Exports - Imports)"
    }, {
      topic: "Economics",
      q: "A country running a current account deficit must have:",
      opts: ["A capital account deficit", "A capital account surplus", "A balanced capital account", "High inflation"],
      ans: 1,
      exp: "Balance of Payments must balance. Current Account Deficit = Capital Account Surplus (net capital inflow)."
    }],
    fra: [{
      topic: "Financial Reporting",
      q: "Under IFRS, inventory can be valued using:",
      opts: ["LIFO only", "FIFO or weighted average cost", "LIFO, FIFO, or weighted average", "FIFO only"],
      ans: 1,
      exp: "IFRS prohibits LIFO. Only FIFO and weighted average cost methods are permitted."
    }, {
      topic: "Financial Reporting",
      q: "Straight-line depreciation compared to accelerated depreciation results in:",
      opts: ["Higher early-year expenses", "Lower early-year net income", "Higher early-year net income", "No difference in total depreciation"],
      ans: 2,
      exp: "Straight-line depreciation has lower early-year expenses than accelerated, resulting in higher early-year net income."
    }, {
      topic: "Financial Reporting",
      q: "Operating cash flow using the indirect method starts with:",
      opts: ["Revenue", "Gross profit", "Net income", "EBITDA"],
      ans: 2,
      exp: "The indirect method starts with net income and adjusts for non-cash items and changes in working capital."
    }, {
      topic: "Financial Reporting",
      q: "A company capitalizing an expense instead of expensing it will have:",
      opts: ["Lower current assets", "Higher current period income", "Lower total assets", "Higher current period expenses"],
      ans: 1,
      exp: "Capitalizing creates an asset and defers expense recognition, resulting in higher current income."
    }, {
      topic: "Financial Reporting",
      q: "The quick ratio excludes which current asset?",
      opts: ["Cash", "Receivables", "Inventory", "Marketable securities"],
      ans: 2,
      exp: "Quick Ratio = (Current Assets - Inventory) / Current Liabilities. Inventory is excluded as it's less liquid."
    }],
    corporate: [{
      topic: "Corporate Issuers",
      q: "The weighted average cost of capital (WACC) is used to:",
      opts: ["Evaluate dividend policy", "Discount project cash flows", "Calculate earnings per share", "Determine stock price"],
      ans: 1,
      exp: "WACC represents the company's blended cost of capital and is used to discount project cash flows for capital budgeting decisions."
    }, {
      topic: "Corporate Issuers",
      q: "According to the pecking order theory, companies prefer financing in which order?",
      opts: ["Debt, equity, internal funds", "Internal funds, debt, equity", "Equity, debt, internal funds", "Internal funds, equity, debt"],
      ans: 1,
      exp: "Pecking order theory: Internal funds first (retained earnings), then debt, then equity as last resort."
    }, {
      topic: "Corporate Issuers",
      q: "A stock split will:",
      opts: ["Increase market capitalization", "Decrease share price proportionally", "Change the P/E ratio", "Affect total shareholder equity"],
      ans: 1,
      exp: "A stock split increases shares outstanding and decreases price proportionally, keeping market cap unchanged."
    }, {
      topic: "Corporate Issuers",
      q: "The agency problem refers to conflicts between:",
      opts: ["Creditors and regulators", "Managers and shareholders", "Shareholders and customers", "Employees and managers"],
      ans: 1,
      exp: "Agency problems arise when managers (agents) may not act in the best interests of shareholders (principals)."
    }],
    derivatives: [{
      topic: "Derivatives",
      q: "A call option is in-the-money when:",
      opts: ["Stock price < Strike price", "Stock price > Strike price", "Stock price = Strike price", "Time value > Intrinsic value"],
      ans: 1,
      exp: "A call option is in-the-money when the underlying stock price exceeds the strike price."
    }, {
      topic: "Derivatives",
      q: "The maximum loss for a buyer of a put option is:",
      opts: ["Unlimited", "Strike price minus premium", "Premium paid", "Stock price"],
      ans: 2,
      exp: "Option buyers can only lose the premium paid. Maximum loss = Premium."
    }, {
      topic: "Derivatives",
      q: "A forward contract differs from a futures contract because forwards are:",
      opts: ["Standardized and exchange-traded", "Customized and traded OTC", "Settled daily", "More liquid"],
      ans: 1,
      exp: "Forwards are customized, traded over-the-counter (OTC), and settled at maturity. Futures are standardized and exchange-traded."
    }, {
      topic: "Derivatives",
      q: "Put-call parity states that:",
      opts: ["Call + Put = Stock", "Stock + Put = Call + Bond", "Call + Bond = Put + Stock", "Stock + Call = Put + Bond"],
      ans: 1,
      exp: "Put-Call Parity: S + P = C + PV(X), or Stock + Put = Call + Present Value of Strike Price."
    }],
    portfolio: [{
      topic: "Portfolio Management",
      q: "Diversification reduces which type of risk?",
      opts: ["Systematic risk", "Unsystematic risk", "Market risk", "Interest rate risk"],
      ans: 1,
      exp: "Diversification reduces unsystematic (company-specific) risk. Systematic risk cannot be diversified away."
    }, {
      topic: "Portfolio Management",
      q: "The Capital Asset Pricing Model (CAPM) calculates:",
      opts: ["Total risk", "Expected return based on beta", "Portfolio variance", "Sharpe ratio"],
      ans: 1,
      exp: "CAPM: E(R) = Rf + β(Rm - Rf). It calculates expected return based on systematic risk (beta)."
    }, {
      topic: "Portfolio Management",
      q: "The efficient frontier represents portfolios that:",
      opts: ["Have the lowest risk", "Have the highest return", "Maximize return for each level of risk", "Are equally weighted"],
      ans: 2,
      exp: "The efficient frontier shows portfolios offering maximum return for each level of risk (or minimum risk for each return level)."
    }, {
      topic: "Portfolio Management",
      q: "A portfolio's Sharpe ratio of 0.8 compared to another with 0.5 indicates:",
      opts: ["Lower risk-adjusted return", "Higher risk-adjusted return", "Higher total return", "Lower total risk"],
      ans: 1,
      exp: "Higher Sharpe ratio = better risk-adjusted return. Sharpe = (Return - Risk-free rate) / Standard Deviation."
    }],
    alternatives: [{
      topic: "Alternative Investments",
      q: "Private equity funds typically have:",
      opts: ["Daily liquidity", "Lock-up periods of several years", "Publicly traded shares", "Low minimum investments"],
      ans: 1,
      exp: "Private equity funds typically have lock-up periods of 7-10 years with limited liquidity."
    }, {
      topic: "Alternative Investments",
      q: "Real estate investment offers which benefit?",
      opts: ["Perfect liquidity", "Inflation hedge", "No management required", "Guaranteed returns"],
      ans: 1,
      exp: "Real estate often serves as an inflation hedge because property values and rents tend to rise with inflation."
    }, {
      topic: "Alternative Investments",
      q: "Hedge funds differ from mutual funds primarily in their:",
      opts: ["Use of leverage and short selling", "Investment in stocks", "SEC registration requirements", "Fee structures only"],
      ans: 0,
      exp: "Hedge funds can use leverage, short selling, and derivatives—strategies typically restricted for mutual funds."
    }]
  };

  // Function to get questions from bank based on selected topics
  // Generate Full 180-question Mock Exam
  const generateFullMockExam = () => {
    const questions = [];
    const distribution = CFA_FULL_EXAM_CONFIG.distribution;
    Object.entries(distribution).forEach(([topicKey, count]) => {
      const topicQuestions = CFA_QUESTION_BANK[topicKey] || [];
      const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
      let selected = shuffled.slice(0, Math.min(count, shuffled.length));

      // If not enough questions, repeat some
      while (selected.length < count && topicQuestions.length > 0) {
        const extra = [...topicQuestions].sort(() => Math.random() - 0.5);
        selected = [...selected, ...extra.slice(0, count - selected.length)];
      }
      questions.push(...selected);
    });
    return questions.sort(() => Math.random() - 0.5);
  };
  const getQuestionsFromBank = config => {
    const {
      numQuestions,
      selectedTopics,
      difficulty
    } = config;
    let allQuestions = [];

    // Gather questions from selected topics
    selectedTopics.forEach(topic => {
      const topicKey = topic.id;
      if (CFA_QUESTION_BANK[topicKey]) {
        allQuestions = [...allQuestions, ...CFA_QUESTION_BANK[topicKey]];
      }
    });

    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);

    // Return requested number
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  };

  // Start Mock Exam - usa database locale per velocità istantanea
  const startMockExam = config => {
    // Usa le domande dal database locale - istantaneo!
    const questions = getQuestionsFromBank(config);
    if (questions.length === 0) {
      setMockExamState(prev => ({
        ...prev,
        loading: false,
        error: 'Nessuna domanda disponibile per i topic selezionati.'
      }));
      return;
    }
    setMockExamState({
      active: true,
      loading: false,
      questions,
      currentIndex: 0,
      answers: [],
      timeRemaining: config.timeLimit * 60,
      // convert minutes to seconds
      sessionTopic: config.topics,
      examConfig: config,
      results: null,
      error: null
    });
  };

  // Timer effect for Mock Exam
  useEffect(() => {
    if (!mockExamState.active || mockExamState.timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setMockExamState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - auto submit
          clearInterval(timer);
          return {
            ...prev,
            timeRemaining: 0
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mockExamState.active]);

  // Submit answer in Mock Exam
  const submitMockAnswer = selectedIndex => {
    const currentQ = mockExamState.questions[mockExamState.currentIndex];
    const isCorrect = selectedIndex === currentQ.ans;
    const newAnswer = {
      questionIndex: mockExamState.currentIndex,
      selectedAnswer: selectedIndex,
      isCorrect,
      question: currentQ
    };
    setMockExamState(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));
  };

  // Go to next question in Mock Exam
  const nextMockQuestion = () => {
    setMockExamState(prev => {
      if (prev.currentIndex >= prev.questions.length - 1) {
        // Exam finished - calculate results
        const correct = prev.answers.filter(a => a.isCorrect).length;
        const total = prev.questions.length;
        const percentage = Math.round(correct / total * 100);
        const passed = percentage >= 70;

        // Award XP
        const baseXP = 500;
        const bonusXP = passed ? 200 : 0;
        const totalXP = baseXP + bonusXP;

        // Update user stats
        setStats(s => ({
          ...s,
          xp: s.xp + totalXP,
          totalQuizzes: s.totalQuizzes + 1,
          correctAnswers: s.correctAnswers + correct,
          totalAnswers: s.totalAnswers + total
        }));
        return {
          ...prev,
          results: {
            correct,
            total,
            percentage,
            passed,
            xpEarned: totalXP,
            topicBreakdown: calculateTopicBreakdown(prev.answers, prev.questions)
          }
        };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1
      };
    });
  };

  // Calculate topic breakdown for results
  const calculateTopicBreakdown = (answers, questions) => {
    const breakdown = {};
    answers.forEach((ans, i) => {
      const topic = questions[i]?.topic || 'General';
      if (!breakdown[topic]) breakdown[topic] = {
        correct: 0,
        total: 0
      };
      breakdown[topic].total++;
      if (ans.isCorrect) breakdown[topic].correct++;
    });
    return breakdown;
  };

  // Reset Mock Exam
  const resetMockExam = () => {
    setMockExamState({
      active: false,
      loading: false,
      questions: [],
      currentIndex: 0,
      answers: [],
      timeRemaining: 0,
      sessionTopic: null,
      examConfig: null,
      results: null,
      error: null
    });
  };

  // ========== LEADERBOARD & PRO SYSTEM ==========
  const [isPro, setIsPro] = useState(userData?.isPro || false);
  const [showProModal, setShowProModal] = useState(false);
  const [mockExamActive, setMockExamActive] = useState(false);
  const [mockExamTimer, setMockExamTimer] = useState(null);

  // Mock leaderboard data (in produzione verrebbe dal backend)
  const [leaderboard] = useState([{
    id: 1,
    name: 'Marco R.',
    xp: 4250,
    avatar: '🦁',
    league: 'diamond',
    change: 0
  }, {
    id: 2,
    name: 'Sofia L.',
    xp: 3890,
    avatar: '🦊',
    league: 'diamond',
    change: 2
  }, {
    id: 3,
    name: 'Andrea M.',
    xp: 3654,
    avatar: '🐺',
    league: 'gold',
    change: -1
  }, {
    id: 4,
    name: 'Giulia B.',
    xp: 3420,
    avatar: '🦋',
    league: 'gold',
    change: 1
  }, {
    id: 5,
    name: 'Luca T.',
    xp: 3180,
    avatar: '🦅',
    league: 'gold',
    change: -2
  }, {
    id: 6,
    name: 'Elena F.',
    xp: 2950,
    avatar: '🐬',
    league: 'silver',
    change: 0
  }, {
    id: 7,
    name: 'Francesco P.',
    xp: 2780,
    avatar: '🐯',
    league: 'silver',
    change: 3
  }, {
    id: 8,
    name: 'Chiara V.',
    xp: 2540,
    avatar: '🦄',
    league: 'silver',
    change: -1
  }, {
    id: 9,
    name: 'Matteo G.',
    xp: 2320,
    avatar: '🐻',
    league: 'bronze',
    change: 0
  }, {
    id: 10,
    name: 'Alessia N.',
    xp: 2100,
    avatar: '🐨',
    league: 'bronze',
    change: -2
  }]);

  // Get user's league based on XP
  const getUserLeague = xp => {
    if (xp >= 4000) return {
      name: 'Diamante',
      icon: '💎',
      color: 'from-cyan-400 to-blue-500'
    };
    if (xp >= 2500) return {
      name: 'Oro',
      icon: '🥇',
      color: 'from-amber-400 to-yellow-500'
    };
    if (xp >= 1000) return {
      name: 'Argento',
      icon: '🥈',
      color: 'from-slate-300 to-slate-400'
    };
    return {
      name: 'Bronzo',
      icon: '🥉',
      color: 'from-orange-400 to-amber-600'
    };
  };

  // Calculate user's rank in leaderboard
  const getUserRank = () => {
    const userXp = stats.xp;
    const rank = leaderboard.filter(u => u.xp > userXp).length + 1;
    return Math.min(rank, 99); // Cap at 99 if not in top
  };

  // Days until weekly reset (Monday)
  const getDaysUntilReset = () => {
    const now = new Date();
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    return daysUntilMonday;
  };

  // Save chats to localStorage when they change
  useEffect(() => {
    if (chats.length > 0) {
      try {
        localStorage.setItem(`finlearn_chats_${user?.uid || 'guest'}`, JSON.stringify(chats));
        console.log('💾 Chats saved to localStorage:', chats.length, 'chats');
      } catch (e) {
        console.error('Error saving chats:', e);
      }
    }
  }, [chats, user?.uid]);

  // Save progress when stats change
  useEffect(() => {
    if (user && onSaveProgress) {
      onSaveProgress({
        stats,
        completedLessons: completed,
        activeLesson,
        settings: {
          timerEnabled: timerOn
        }
      });
    }
  }, [stats, completed, activeLesson, timerOn]);

  // Timer effect
  useEffect(() => {
    if (quiz && timerOn && timer > 0 && !answered) {
      const id = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(id);
    }
    if (timer === 0 && !answered) setAnswered(true);
  }, [quiz, timerOn, timer, answered]);

  // Load KaTeX
  useEffect(() => {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
    if (!window.katex) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      document.head.appendChild(script);
    }
  }, []);

  // ========== IMAGE SYSTEM ==========
  const IMAGES = {
    // Hero images per topic (Unsplash - ottimizzate per performance)
    topics: {
      bonds: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      fixedIncome: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
      equity: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      derivatives: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",
      portfolio: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      economics: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
    },
    // Sfondi decorativi
    backgrounds: {
      hero: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
      profile: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80",
      leaderboard: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
    },
    // Badge per leghe
    leagues: {
      bronze: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=200&q=80",
      silver: "https://images.unsplash.com/photo-1610375461249-cba53a8ba5c3?w=200&q=80",
      gold: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=80",
      diamond: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=200&q=80"
    }
  };

  // SVG Icone Custom per UI
  const BullIcon = ({
    size = 40,
    className = ""
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    className: className
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "bullGrad",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#fbbf24"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#ea580c"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "45",
    fill: "url(#bullGrad)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "50",
    y: "62",
    textAnchor: "middle",
    fontSize: "40"
  }, "\uD83D\uDC02"));
  const TrophyIcon = ({
    size = 40,
    color = "#fbbf24"
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 22h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 2H6v7a6 6 0 0 0 12 0V2Z"
  }));
  const FlameIcon = ({
    size = 24,
    animated = false
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    className: animated ? "animate-pulse" : ""
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "flameGrad",
    x1: "0%",
    y1: "100%",
    x2: "0%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#ea580c"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#f59e0b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#fcd34d"
  }))), /*#__PURE__*/React.createElement("path", {
    fill: "url(#flameGrad)",
    d: "M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.405-4.83 3.49-6.035-.145 1.035.09 2.09.67 2.965.65.98 1.64 1.67 2.76 1.94-.17-.89-.08-1.82.25-2.65.33-.84.88-1.54 1.58-2.02-.12.66.02 1.35.39 1.92.37.57.95.99 1.62 1.18-.19-.73-.15-1.5.11-2.22.27-.72.74-1.35 1.35-1.78-.08.87.13 1.75.58 2.5.45.74 1.12 1.32 1.9 1.65C19.89 15.08 19 18.91 15 21.5c-.95.58-2.02.96-3.15 1.1-.61.08-1.23.08-1.85.01V23z"
  }));
  const XPBadge = ({
    xp,
    size = "md"
  }) => {
    const sizes = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-3 py-1",
      lg: "text-base px-4 py-1.5"
    };
    return /*#__PURE__*/React.createElement("div", {
      className: `inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full ${sizes[size]}`
    }, /*#__PURE__*/React.createElement(Zap, {
      size: size === "sm" ? 12 : size === "md" ? 14 : 16
    }), xp, " XP");
  };
  const LeagueBadge = ({
    league,
    size = 40
  }) => {
    const leagues = {
      bronze: {
        bg: "from-orange-600 to-amber-700",
        icon: "🥉",
        name: "Bronze"
      },
      silver: {
        bg: "from-slate-300 to-slate-400",
        icon: "🥈",
        name: "Silver"
      },
      gold: {
        bg: "from-amber-400 to-yellow-500",
        icon: "🥇",
        name: "Gold"
      },
      diamond: {
        bg: "from-cyan-400 to-blue-500",
        icon: "💎",
        name: "Diamond"
      }
    };
    const l = leagues[league] || leagues.bronze;
    return /*#__PURE__*/React.createElement("div", {
      className: `w-${size / 4} h-${size / 4} bg-gradient-to-br ${l.bg} rounded-full flex items-center justify-center shadow-lg`,
      style: {
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: size * 0.5
      }
    }, l.icon));
  };

  // Achievement Card Component
  const AchievementCard = ({
    icon,
    title,
    description,
    unlocked = false
  }) => /*#__PURE__*/React.createElement("div", {
    className: `relative p-4 rounded-xl border-2 transition-all ${unlocked ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700 opacity-60'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-700'}`
  }, icon), /*#__PURE__*/React.createElement("h4", {
    className: `font-bold ${unlocked ? 'text-white' : 'text-slate-500'}`
  }, title), /*#__PURE__*/React.createElement("p", {
    className: `text-xs mt-1 ${unlocked ? 'text-slate-400' : 'text-slate-600'}`
  }, description), unlocked && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2 right-2 text-emerald-400"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 16
  })));

  // DATA
  const topics = {
    bonds: {
      id: 'bonds',
      title: 'Obbligazioni',
      icon: '📊',
      level: 'base',
      time: '45 min',
      image: IMAGES.topics.bonds,
      color: 'from-blue-500 to-cyan-500',
      theory: [{
        title: "Cos'è un'obbligazione?",
        content: "💡 Un bond è un prestito che TU fai!\n\nL'emittente (governo, azienda) ti promette:\n• Pagamenti periodici (coupon)\n• Rimborso del capitale a scadenza\n\nTermini chiave:\n• Face Value: importo rimborsato\n• Coupon Rate: tasso annuale\n• Maturity: data scadenza\n• Yield: rendimento effettivo"
      }, {
        title: "Relazione Prezzo-Yield",
        content: "📐 Regola fondamentale:\n\n⬆️ Tassi = ⬇️ Prezzi\n⬇️ Tassi = ⬆️ Prezzi\n\nPerché? I vecchi bond con coupon bassi valgono meno quando i nuovi offrono di più!"
      }],
      cards: [{
        front: "Cos'è un'obbligazione?",
        back: "Titolo di DEBITO: presti soldi all'emittente, ricevi interessi + capitale",
        mnemonic: "🏦 Tu sei la banca!"
      }, {
        front: "Coupon Rate",
        back: "Tasso di interesse annuo sul Face Value",
        formula: "\\text{Coupon} = FV \\times \\text{Rate}",
        example: "5% su €1.000 = €50/anno"
      }, {
        front: "Relazione Prezzo-Yield",
        back: "INVERSA! Yield ↑ = Price ↓",
        formula: "\\uparrow y \\Rightarrow \\downarrow P",
        mnemonic: "🎢 Salgono e scendono opposti"
      }],
      questions: [
      // === BOND FEATURES & BASICS (10 domande) ===
      {
        q: "Un'obbligazione con original maturity di 9 mesi è classificata come:",
        opts: ["Money market security", "Capital market security", "Perpetual bond"],
        ans: 0,
        exp: "Bonds con original maturity ≤1 anno sono money market securities. Oltre 1 anno sono capital market securities.",
        time: 30,
        topic: "features"
      }, {
        q: "Il tenor di un'obbligazione si riferisce:",
        opts: ["All'original maturity quando fu emessa", "Al tempo rimanente fino alla scadenza", "Al coupon rate del bond"],
        ans: 1,
        exp: "Tenor = tempo RIMANENTE fino alla maturity. Original maturity = durata iniziale.",
        time: 30,
        topic: "features"
      }, {
        q: "Un bond con 5% coupon rate semestrale e $1,000 par value paga ogni 6 mesi:",
        opts: ["$25", "$50", "$100"],
        ans: 0,
        exp: "Pagamento semestrale = (5% × $1,000) / 2 = $25. Il coupon annuale viene diviso per 2.",
        time: 30,
        topic: "features"
      }, {
        q: "La relazione tra prezzi e yields delle obbligazioni a cedola fissa è:",
        opts: ["Positiva", "Inversa", "Nessuna relazione"],
        ans: 1,
        exp: "Prezzi e yields hanno relazione INVERSA: quando yields salgono, i prezzi scendono e viceversa.",
        time: 30,
        topic: "features"
      }, {
        q: "Una yield curve normale è:",
        opts: ["Piatta", "Inclinata verso l'alto (upward-sloping)", "Inclinata verso il basso"],
        ans: 1,
        exp: "Normal yield curve = upward-sloping: yields più alti per maturities più lunghe.",
        time: 30,
        topic: "features"
      }, {
        q: "Il benchmark yield curve è tipicamente costruito usando:",
        opts: ["Corporate bonds", "Government bonds", "Municipal bonds"],
        ans: 1,
        exp: "Government bonds sono il benchmark per il lowest credit risk e massima liquidità.",
        time: 30,
        topic: "features"
      }, {
        q: "Un bond domestico è emesso:",
        opts: ["In un paese straniero", "Nel paese dell'issuer nella sua currency", "Solo in USD"],
        ans: 1,
        exp: "Domestic bond: emesso e traded nel paese dell'issuer, nella home currency.",
        time: 30,
        topic: "features"
      }, {
        q: "Eurobonds sono issued:",
        opts: ["Solo in Europa", "Outside jurisdiction di any single country", "Solo in EUR"],
        ans: 1,
        exp: "Eurobonds: emessi fuori dalla jurisdiction di qualsiasi paese, possono essere in ANY currency.",
        time: 45,
        topic: "features"
      }, {
        q: "Cosa rappresenta lo 'yield to maturity' (YTM)?",
        opts: ["Solo gli interessi annuali", "Il rendimento totale se detenuto fino a scadenza", "Il prezzo attuale"],
        ans: 1,
        exp: "YTM = tasso che eguaglia PV di tutti i flussi futuri al prezzo corrente. È il rendimento TOTALE.",
        time: 30,
        topic: "features"
      }, {
        q: "Cosa significa che un bond quota 'above par'?",
        opts: ["Prezzo < valore nominale", "Prezzo = valore nominale", "Prezzo > valore nominale"],
        ans: 2,
        exp: "Above par = prezzo > 100 (sopra il nominale). Succede quando coupon > tassi di mercato.",
        time: 30,
        topic: "features"
      },
      // === CASH FLOW STRUCTURES (10 domande) ===
      {
        q: "Con TIPS (Treasury Inflation-Protected), in caso di deflation alla maturity:",
        opts: ["Si riceve il deflated principal", "Si riceve il MAX tra adjusted e original par", "Si riceve zero"],
        ans: 1,
        exp: "TIPS protezione: alla maturity ricevi il MASSIMO tra inflation-adjusted principal e original par.",
        time: 45,
        topic: "structures"
      }, {
        q: "Su un capital-indexed bond con 3% coupon annuo e 1% inflation semestrale, il primo coupon su $1,000 è:",
        opts: ["$15.00", "$15.15", "$30.00"],
        ans: 1,
        exp: "Principal adjusted: $1,000 × 1.01 = $1,010. Semiannual coupon: $1,010 × 1.5% = $15.15.",
        time: 60,
        topic: "structures"
      }, {
        q: "Zero-coupon bonds pagano:",
        opts: ["Coupon periodici", "Solo par value alla maturity", "Interest mensile"],
        ans: 1,
        exp: "Zero-coupon: NESSUN coupon periodico, solo single payment di par alla scadenza.",
        time: 30,
        topic: "structures"
      }, {
        q: "Zero-coupon bonds sono popolari con investors che vogliono minimizzare:",
        opts: ["Credit risk", "Reinvestment risk", "Interest rate risk"],
        ans: 1,
        exp: "Senza periodic coupons, NON c'è reinvestment risk. Il return è locked in all'acquisto.",
        time: 45,
        topic: "structures"
      }, {
        q: "Zero-coupon bonds devono essere priced:",
        opts: ["At par", "Above par", "Below par (a sconto)"],
        ans: 2,
        exp: "Zero-coupon = pure discount bonds. Devono tradare SOTTO par per offrire positive return.",
        time: 30,
        topic: "structures"
      }, {
        q: "Un deferred coupon bond:",
        opts: ["Non paga mai coupons", "Inizia coupon payments dopo un periodo specificato", "Paga tutti coupons alla maturity"],
        ans: 1,
        exp: "Deferred coupon: regular payments iniziano DOPO un periodo specificato dall'emissione.",
        time: 45,
        topic: "structures"
      }, {
        q: "La duration di un zero-coupon bond è:",
        opts: ["Zero", "Uguale alla sua maturity", "Metà della maturity"],
        ans: 1,
        exp: "Zero-coupon: unico cash flow a scadenza → Macaulay Duration = Maturity ESATTAMENTE.",
        time: 30,
        topic: "structures"
      }, {
        q: "Qual è la caratteristica principale di un'obbligazione zero-coupon?",
        opts: ["Paga cedole trimestrali", "Non paga cedole periodiche", "Ha duration pari a zero"],
        ans: 1,
        exp: "Zero-coupon: emesse a SCONTO, nessuna cedola, rimborsate al valore nominale alla scadenza.",
        time: 30,
        topic: "structures"
      }, {
        q: "Il coupon rate di un capital-indexed bond può essere visto come:",
        opts: ["Nominal rate", "Real rate of interest", "Risk-free rate"],
        ans: 1,
        exp: "Il coupon è il REAL rate; gli inflation adjustments proteggono il purchasing power.",
        time: 45,
        topic: "structures"
      }, {
        q: "Cosa indica il 'credit spread'?",
        opts: ["Differenza prezzo-nominale", "Differenza rendimento corporate vs gov bond", "La duration"],
        ans: 1,
        exp: "Credit spread = YTM corporate - YTM government. Premio per il maggior rischio di credito.",
        time: 30,
        topic: "structures"
      },
      // === REPOS & MONEY MARKETS (10 domande) ===
      {
        q: "In un repo, il purchase price è effettivamente:",
        opts: ["Il prezzo definitivo", "Un loan dal buyer al seller", "Solo un deposito"],
        ans: 1,
        exp: "Repo purchase price = loan amount. Il buyer presta cash, il seller dà securities come collateral.",
        time: 45,
        topic: "repos"
      }, {
        q: "La differenza tra repurchase e purchase price in un repo rappresenta:",
        opts: ["Il principal", "L'interest pagato al lender", "Una fee"],
        ans: 1,
        exp: "Repurchase - Purchase = INTEREST pagato al security buyer (cash lender) al repo rate.",
        time: 45,
        topic: "repos"
      }, {
        q: "Se initial margin è 103%, il purchase price è:",
        opts: ["103% del security value", "Security value ÷ 1.03", "Security value × 1.03"],
        ans: 1,
        exp: "Purchase price (loan) = Security Market Value / Initial Margin. Es: $1M / 1.03 ≈ $970,874.",
        time: 45,
        topic: "repos"
      }, {
        q: "L'haircut in un repo rappresenta:",
        opts: ["Una fee fissa", "Il discount sul security value per calcolare il loan", "L'interest rate"],
        ans: 1,
        exp: "Haircut = 1 - (1/Initial Margin). Es: margin 103% → haircut = 1 - 1/1.03 ≈ 2.9%.",
        time: 45,
        topic: "repos"
      }, {
        q: "Variation margin è richiesta quando:",
        opts: ["Sempre, ogni giorno", "Il security value scende sotto loan × initial margin", "Mai, è opzionale"],
        ans: 1,
        exp: "Variation margin: extra collateral richiesto se security value < loan value × initial margin.",
        time: 45,
        topic: "repos"
      }, {
        q: "Un overnight repo ha term di:",
        opts: ["Una settimana", "Un giorno", "Un mese"],
        ans: 1,
        exp: "Overnight repo = ONE-DAY repurchase agreement. Term repo = più di un giorno.",
        time: 30,
        topic: "repos"
      }, {
        q: "Un tri-party repo impiega:",
        opts: ["Solo due parti", "Un terzo intermediario (custodian)", "Tre tipi di collateral"],
        ans: 1,
        exp: "Tri-party: third party (custodian bank) gestisce collateral, valuation, settlement. Riduce operational risk.",
        time: 45,
        topic: "repos"
      }, {
        q: "Un bilateral repo è:",
        opts: ["Con terze parti", "Direttamente tra due parti senza intermediario", "Sempre su exchange"],
        ans: 1,
        exp: "Bilateral repo: struck direttamente tra borrower e lender, senza third-party intermediary.",
        time: 30,
        topic: "repos"
      }, {
        q: "Il repo rate è tipicamente più ALTO per:",
        opts: ["Term più brevi", "Term più lunghi (yield curve normale)", "Collateral di alta qualità"],
        ans: 1,
        exp: "Longer repo term → higher rate (quando yield curve è normal/upward-sloping).",
        time: 45,
        topic: "repos"
      }, {
        q: "Il repo rate è tipicamente più BASSO quando:",
        opts: ["Collateral ha bassa qualità", "Collateral ha ALTA qualità e alta domanda", "È undercollateralized"],
        ans: 1,
        exp: "High quality collateral + high demand = LOWER repo rate. Il lender accetta meno rendimento.",
        time: 45,
        topic: "repos"
      }]
    },
    cfa: {
      id: 'cfa',
      title: 'Fixed Income CFA',
      icon: '🎓',
      level: 'avanzato',
      time: '8 ore',
      image: IMAGES.topics.fixedIncome,
      color: 'from-purple-500 to-indigo-600',
      theory: [{
        title: "CFA Fixed Income",
        content: "🎓 Il 10-12% dell'esame!\n\nTopics:\n• Bond Valuation & YTM\n• Duration & Convexity\n• Term Structure\n• Credit Analysis\n• MBS/ABS basics"
      }],
      formulas: {
        'Bond Valuation': [{
          name: 'Bond Price',
          formula: 'P = \\sum_{t=1}^{N} \\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^N}',
          desc: 'PV di tutti i cash flows'
        }, {
          name: 'Full Price',
          formula: 'P_{full} = P_{flat} + AI',
          desc: 'Prezzo + Accrued Interest'
        }, {
          name: 'Accrued Interest',
          formula: 'AI = \\frac{C}{m} \\times \\frac{t}{T}',
          desc: 't=giorni passati, T=giorni periodo'
        }],
        'Yield Measures': [{
          name: 'Current Yield',
          formula: 'CY = \\frac{\\text{Annual Coupon}}{\\text{Price}}',
          desc: 'Rendimento semplice'
        }, {
          name: 'BEY',
          formula: 'BEY = 2 \\times YTM_{semi}',
          desc: 'Bond Equivalent Yield'
        }, {
          name: 'EAY',
          formula: 'EAY = (1 + YTM_{semi})^2 - 1',
          desc: 'Effective Annual Yield'
        }, {
          name: 'G-Spread',
          formula: 'G = YTM_{bond} - YTM_{gov}',
          desc: 'vs Government benchmark'
        }, {
          name: 'Z-Spread',
          formula: 'P = \\sum \\frac{CF_t}{(1+S_t+Z)^t}',
          desc: 'Spread costante su spot curve'
        }, {
          name: 'OAS',
          formula: 'OAS = Z - \\text{Option Value}',
          desc: 'Option-Adjusted Spread'
        }],
        'Duration': [{
          name: 'Macaulay Duration',
          formula: 'MacD = \\frac{\\sum t \\times PV(CF_t)}{P}',
          desc: 'Tempo medio ponderato'
        }, {
          name: 'Modified Duration',
          formula: 'ModD = \\frac{MacD}{1 + y/m}',
          desc: 'Sensibilità al tasso'
        }, {
          name: 'Effective Duration',
          formula: 'EffD = \\frac{P_- - P_+}{2 \\times \\Delta y \\times P_0}',
          desc: 'Per bond con opzioni'
        }, {
          name: 'Price Change',
          formula: '\\%\\Delta P \\approx -ModD \\times \\Delta y',
          desc: 'Approssimazione lineare'
        }],
        'Convexity': [{
          name: 'Convexity Adjustment',
          formula: 'Conv\\_Adj = \\frac{1}{2} \\times Conv \\times (\\Delta y)^2',
          desc: 'Sempre positivo per option-free'
        }, {
          name: 'Full Price Change',
          formula: '\\%\\Delta P \\approx -ModD \\cdot \\Delta y + \\frac{1}{2}Conv(\\Delta y)^2',
          desc: 'Con convexity adjustment'
        }],
        'Forward Rates': [{
          name: 'Forward da Spot',
          formula: 'f_{1,1} = \\frac{(1+S_2)^2}{(1+S_1)} - 1',
          desc: '1-year forward, 1-year from now'
        }, {
          name: 'General Forward',
          formula: '(1+S_A)^A \\times (1+f_{A,B-A})^{B-A} = (1+S_B)^B',
          desc: 'No arbitrage condition'
        }]
      },
      cards: [{
        front: "Macaulay Duration",
        back: "Tempo medio ponderato per ricevere i cash flows del bond, misurato in anni",
        formula: "MacD = \\frac{\\sum_{t=1}^{N} t \\times \\frac{CF_t}{(1+y)^t}}{P}",
        mnemonic: "⏱️ 'Quanto tempo in media aspetto?'",
        example: "MacD = 5.2 anni → in media ricevi flussi dopo 5.2 anni"
      }, {
        front: "Modified Duration",
        back: "Misura la sensibilità percentuale del prezzo a variazioni di 1% dello yield",
        formula: "ModD = \\frac{MacD}{1 + y/m}",
        mnemonic: "📉 'Di quanto scendo se yield sale 1%?'",
        example: "ModD = 7 → se yield +1%, price ≈ -7%"
      }, {
        front: "Current Yield vs YTM",
        back: "CY = coupon/prezzo (snapshot). YTM include anche capital gain/loss a maturity (film completo)",
        formula: "CY = \\frac{C}{P}",
        mnemonic: "🎯 CY = foto, YTM = video",
        example: "Premium bond: Coupon > CY > YTM"
      }, {
        front: "Convexity",
        back: "Misura la curvatura della relazione prezzo-yield. Sempre 'amica' del bondholder per option-free bonds",
        formula: "\\%\\Delta P \\approx -ModD \\cdot \\Delta y + \\frac{1}{2}Conv(\\Delta y)^2",
        mnemonic: "🌈 Curva = sempre meglio che linea",
        example: "Alta convexity = meglio sia se tassi ↑ che ↓"
      }, {
        front: "Premium vs Discount Bond",
        back: "Premium: P > Par, Coupon > YTM. Discount: P < Par, Coupon < YTM. Par: P = Par, Coupon = YTM",
        formula: "\\text{Premium: } C > YTM \\Rightarrow P > 100",
        mnemonic: "💰 Paghi di più se il coupon è generoso",
        example: "Bond 6% quando mercato 4% → quota sopra par"
      }, {
        front: "G-Spread vs Z-Spread",
        back: "G-Spread = vs singolo gov bond (stesso maturity). Z-Spread = spread COSTANTE su TUTTA la spot curve",
        formula: "G = YTM - YTM_{gov}",
        mnemonic: "G = gross (semplice), Z = zero-volatility (preciso)",
        example: "Z-Spread considera shape della curva"
      }, {
        front: "Callable Bond Duration",
        back: "Quando tassi bassi (call probabile), duration < option-free. Quando tassi alti, duration ≈ option-free",
        formula: "\\text{Low yields} \\Rightarrow \\text{Lower duration}",
        mnemonic: "📞 Se ti richiamano presto, aspetti meno",
        example: "Call at low yields = price capped = less sensitive"
      }, {
        front: "Effective Duration",
        back: "Usata per bond con opzioni embedded. Basata su shock alla benchmark curve, non al singolo yield",
        formula: "EffD = \\frac{P_- - P_+}{2 \\times \\Delta y \\times P_0}",
        mnemonic: "⚡ Effective = per bond 'complicati'",
        example: "Callable, putable, MBS usano effective duration"
      }],
      questions: [{
        q: "Bond semiannuale, coupon 6%, FV $1.000 paga ogni 6 mesi:",
        opts: ["$30", "$60", "$120"],
        ans: 0,
        exp: "(6%×$1.000)/2 = $30",
        time: 30,
        topic: "valuation"
      }, {
        q: "Se ModD = 6 e yield +0.5%, price change ≈",
        opts: ["-3%", "+3%", "-6%"],
        ans: 0,
        exp: "%ΔP ≈ -6 × 0.005 = -3%",
        time: 45,
        topic: "duration"
      }, {
        q: "Premium bond: ordine corretto?",
        opts: ["Coupon > CY > YTM", "YTM > CY > Coupon", "Tutti uguali"],
        ans: 0,
        exp: "Premium (P>Par): Coupon > CY > YTM",
        time: 45,
        topic: "yield"
      }, {
        q: "Zero-coupon bond duration equals:",
        opts: ["Zero", "Its maturity", "Half its maturity"],
        ans: 1,
        exp: "ZCB: unico cash flow a maturity → MacDur = Maturity",
        time: 30,
        topic: "duration"
      }, {
        q: "Effective duration è usata per:",
        opts: ["Solo government bonds", "Bond con opzioni embedded", "Solo zero-coupon bonds"],
        ans: 1,
        exp: "Effective dur per callable, putable, MBS - considera l'effetto delle opzioni",
        time: 45,
        topic: "duration"
      }, {
        q: "Il BEY di un bond con YTM semestrale 2.5% è:",
        opts: ["2.5%", "5.0%", "5.0625%"],
        ans: 1,
        exp: "BEY = 2 × semiannual YTM = 2 × 2.5% = 5.0%",
        time: 30,
        topic: "yield"
      }, {
        q: "L'EAY dello stesso bond (YTM semi 2.5%) è:",
        opts: ["5.0%", "5.0625%", "2.5%"],
        ans: 1,
        exp: "EAY = (1.025)² - 1 = 5.0625%. EAY > BEY per effetto compounding",
        time: 45,
        topic: "yield"
      }, {
        q: "Convexity adjustment per option-free bond è:",
        opts: ["Sempre negativo", "Sempre positivo", "Può essere entrambi"],
        ans: 1,
        exp: "Conv adj = ½×Conv×(Δy)². Conv positiva × (Δy)² positivo = sempre positivo",
        time: 45,
        topic: "duration"
      }]
    },
    stocks: {
      id: 'stocks',
      title: 'Azioni',
      icon: '📈',
      level: 'base',
      time: '40 min',
      theory: [{
        title: "Cos'è un'azione?",
        content: "📈 Un'azione è una QUOTA DI PROPRIETÀ di un'azienda!\n\nQuando compri un'azione diventi SOCIO:\n• Diritto a dividendi (se distribuiti)\n• Diritto di voto in assemblea (common stock)\n• Capital gain se il prezzo sale\n\nDifferenza chiave vs Bond:\n• Bond = DEBITO (sei creditore)\n• Azione = EQUITY (sei proprietario)"
      }, {
        title: "Tipi di Azioni",
        content: "🏷️ Due categorie principali:\n\nCOMMON STOCK (Ordinarie):\n• Diritto di voto ✓\n• Dividendi variabili\n• Ultima priorità in liquidazione\n\nPREFERRED STOCK (Privilegiate):\n• Nessun voto ✗\n• Dividendi FISSI e prioritari\n• Priorità sui common in liquidazione\n\n💡 Preferred = ibrido tra bond e azione!"
      }, {
        title: "Valutazione Base",
        content: "📊 Metriche fondamentali:\n\nEPS = Utile Netto / Azioni\n→ Quanto guadagna l'azienda per ogni azione\n\nP/E = Prezzo / EPS\n→ Quanto paghi per €1 di utili\n→ P/E alto = costoso o alte aspettative\n\nDividend Yield = Dividendo / Prezzo\n→ Rendimento da dividendi\n\nMarket Cap = Prezzo × N. Azioni\n→ Valore totale dell'azienda in borsa"
      }],
      cards: [{
        front: "Cos'è un'azione?",
        back: "Quota di PROPRIETÀ di un'azienda. Ti rende socio con diritto a dividendi e capital gain.",
        mnemonic: "🏢 Compri un pezzo dell'azienda!"
      }, {
        front: "Common vs Preferred Stock",
        back: "Common: voto + dividendi variabili. Preferred: NO voto + dividendi fissi prioritari.",
        mnemonic: "🗳️ Common vota, 💰 Preferred incassa prima"
      }, {
        front: "EPS (Earnings Per Share)",
        back: "Utile netto diviso per numero di azioni. Misura la profittabilità per azione.",
        formula: "EPS = \\frac{Net\\ Income - Pref\\ Div}{Shares}",
        example: "Utile €10M, 5M azioni → EPS = €2"
      }, {
        front: "P/E Ratio",
        back: "Prezzo diviso EPS. Indica quanto paghi per €1 di utili. Alto = costoso o growth.",
        formula: "P/E = \\frac{Price}{EPS}",
        example: "Prezzo €30, EPS €2 → P/E = 15x"
      }, {
        front: "Dividend Yield",
        back: "Dividendo annuo diviso prezzo. Rendimento % da dividendi.",
        formula: "DY = \\frac{DPS}{Price}",
        example: "Div €1.50, Prezzo €50 → DY = 3%"
      }, {
        front: "Market Cap",
        back: "Prezzo × Azioni outstanding. Valore totale dell'azienda sul mercato.",
        formula: "MC = Price \\times Shares",
        example: "€20 × 500M = €10 miliardi"
      }, {
        front: "Book Value per Share",
        back: "Equity totale diviso azioni. Valore contabile per azione.",
        formula: "BVPS = \\frac{Total\\ Equity}{Shares}",
        mnemonic: "📚 Quanto vale 'sui libri'"
      }, {
        front: "ROE (Return on Equity)",
        back: "Utile netto diviso Equity. Misura l'efficienza del capitale proprio.",
        formula: "ROE = \\frac{Net\\ Income}{Equity}",
        example: "ROE 15% = €15 di utile per €100 di equity"
      }, {
        front: "Beta",
        back: "Misura la volatilità vs mercato. Beta > 1 = più volatile, < 1 = meno volatile.",
        formula: "\\beta = \\frac{Cov(R_i, R_m)}{Var(R_m)}",
        mnemonic: "📊 Beta 1.5 = 50% più volatile del mercato"
      }, {
        front: "PEG Ratio",
        back: "P/E diviso tasso di crescita EPS. Considera la crescita nel valutare il P/E.",
        formula: "PEG = \\frac{P/E}{g}",
        example: "P/E 20, growth 20% → PEG = 1 (fair)"
      }],
      formulas: {
        'Valuation Ratios': [{
          name: 'P/E Ratio',
          formula: 'P/E = \\frac{Price}{EPS}',
          desc: 'Prezzo per €1 di utili'
        }, {
          name: 'PEG Ratio',
          formula: 'PEG = \\frac{P/E}{g}',
          desc: 'P/E aggiustato per crescita (g in %)'
        }, {
          name: 'P/B Ratio',
          formula: 'P/B = \\frac{Price}{BVPS}',
          desc: 'Prezzo vs valore contabile'
        }, {
          name: 'P/S Ratio',
          formula: 'P/S = \\frac{Price}{Sales/Share}',
          desc: 'Prezzo vs ricavi per azione'
        }, {
          name: 'EV/EBITDA',
          formula: 'EV/EBITDA = \\frac{MC + Debt - Cash}{EBITDA}',
          desc: 'Valutazione enterprise'
        }],
        'Per Share Metrics': [{
          name: 'EPS',
          formula: 'EPS = \\frac{Net\\ Income - Pref\\ Div}{Shares}',
          desc: 'Utile per azione'
        }, {
          name: 'BVPS',
          formula: 'BVPS = \\frac{Total\\ Equity}{Shares}',
          desc: 'Valore contabile per azione'
        }, {
          name: 'DPS',
          formula: 'DPS = \\frac{Total\\ Dividends}{Shares}',
          desc: 'Dividendo per azione'
        }],
        'Returns & Yields': [{
          name: 'Dividend Yield',
          formula: 'DY = \\frac{DPS}{Price}',
          desc: 'Rendimento da dividendi'
        }, {
          name: 'Total Return',
          formula: 'R = \\frac{P_1 - P_0 + Div}{P_0}',
          desc: 'Capital gain + dividendi'
        }, {
          name: 'Payout Ratio',
          formula: 'Payout = \\frac{DPS}{EPS}',
          desc: '% utili distribuiti'
        }],
        'Profitability': [{
          name: 'ROE',
          formula: 'ROE = \\frac{Net\\ Income}{Equity}',
          desc: 'Ritorno sul capitale proprio'
        }, {
          name: 'ROA',
          formula: 'ROA = \\frac{Net\\ Income}{Assets}',
          desc: 'Ritorno sugli asset'
        }, {
          name: 'Profit Margin',
          formula: 'Margin = \\frac{Net\\ Income}{Revenue}',
          desc: 'Margine netto'
        }],
        'Size & Value': [{
          name: 'Market Cap',
          formula: 'MC = Price \\times Shares',
          desc: 'Capitalizzazione di mercato'
        }, {
          name: 'Enterprise Value',
          formula: 'EV = MC + Debt - Cash',
          desc: 'Valore totale impresa'
        }]
      },
      questions: [
      // === BASICS (5 domande) ===
      {
        q: "Un'azione rappresenta:",
        opts: ["Un debito dell'azienda verso te", "Una quota di proprietà dell'azienda", "Un prestito che fai all'azienda"],
        ans: 1,
        exp: "Azione = EQUITY = proprietà. Bond = DEBITO = prestito.",
        time: 30,
        topic: "basics"
      }, {
        q: "Chi ha priorità nella distribuzione dei dividendi?",
        opts: ["Common stockholders", "Preferred stockholders", "Entrambi hanno uguale priorità"],
        ans: 1,
        exp: "Preferred stock ha PRIORITÀ sui dividendi rispetto ai common shareholders.",
        time: 30,
        topic: "basics"
      }, {
        q: "Il diritto di voto in assemblea spetta tipicamente a:",
        opts: ["Solo Preferred stockholders", "Solo Common stockholders", "Entrambi"],
        ans: 1,
        exp: "Common stock = voting rights. Preferred stock generalmente NON ha diritto di voto.",
        time: 30,
        topic: "basics"
      }, {
        q: "Il capital gain si realizza quando:",
        opts: ["Ricevi un dividendo", "Vendi l'azione a un prezzo superiore all'acquisto", "L'azienda aumenta il capitale"],
        ans: 1,
        exp: "Capital gain = Prezzo vendita > Prezzo acquisto. È il guadagno dalla variazione di prezzo.",
        time: 30,
        topic: "basics"
      }, {
        q: "Un'azione 'growth' tipicamente ha:",
        opts: ["Alto dividend yield", "Basso o zero dividend yield", "Dividendi garantiti"],
        ans: 1,
        exp: "Growth stocks reinvestono gli utili per crescere → dividendi bassi o nulli. Value stocks pagano più dividendi.",
        time: 45,
        topic: "basics"
      },
      // === VALUATION (5 domande) ===
      {
        q: "Se EPS = €2 e P/E = 15, qual è il prezzo dell'azione?",
        opts: ["€30", "€7.50", "€17"],
        ans: 0,
        exp: "P/E = Price/EPS → Price = P/E × EPS = 15 × €2 = €30",
        time: 45,
        topic: "valuation"
      }, {
        q: "Un P/E ratio alto suggerisce che:",
        opts: ["L'azione è sottovalutata", "L'azione è sopravvalutata o ha alte aspettative di crescita", "L'azienda sta perdendo soldi"],
        ans: 1,
        exp: "P/E alto = paghi di più per €1 di utili. Può indicare sopravvalutazione O alte aspettative di crescita.",
        time: 45,
        topic: "valuation"
      }, {
        q: "Se il dividendo annuo è €1.50 e il prezzo è €50, il dividend yield è:",
        opts: ["3%", "33%", "0.03%"],
        ans: 0,
        exp: "DY = Dividendo/Prezzo = €1.50/€50 = 0.03 = 3%",
        time: 30,
        topic: "valuation"
      }, {
        q: "Un'azienda ha Market Cap €10B e 500M azioni. Il prezzo per azione è:",
        opts: ["€20", "€50", "€5000"],
        ans: 0,
        exp: "Price = Market Cap / Shares = €10B / 500M = €20 per azione",
        time: 45,
        topic: "valuation"
      }, {
        q: "ROE del 15% significa:",
        opts: ["15% di ritorno sul debito", "15% di ritorno sull'equity", "15% di dividendi"],
        ans: 1,
        exp: "ROE = Net Income / Equity. ROE 15% = €15 di utile per ogni €100 di capitale proprio.",
        time: 30,
        topic: "valuation"
      },
      // === INTERMEDIATE (5 domande) ===
      {
        q: "Le 'Blue Chip' stocks sono:",
        opts: ["Startup ad alto rischio", "Aziende grandi, stabili e consolidate", "Penny stocks"],
        ans: 1,
        exp: "Blue chips = large-cap, aziende stabili con track record solido (es: Apple, Microsoft, J&J).",
        time: 30,
        topic: "intermediate"
      }, {
        q: "Uno stock split 2:1 significa:",
        opts: ["Il prezzo raddoppia", "Le azioni raddoppiano e il prezzo dimezza", "I dividendi raddoppiano"],
        ans: 1,
        exp: "Split 2:1: ogni azione diventa 2, prezzo si dimezza. Il valore totale NON cambia.",
        time: 45,
        topic: "intermediate"
      }, {
        q: "Un buyback (riacquisto azioni) tipicamente:",
        opts: ["Aumenta l'EPS", "Diminuisce l'EPS", "Non ha effetto sull'EPS"],
        ans: 0,
        exp: "Buyback riduce shares outstanding → stesso utile / meno azioni = EPS più alto.",
        time: 45,
        topic: "intermediate"
      }, {
        q: "Un Beta > 1 indica che l'azione è:",
        opts: ["Meno volatile del mercato", "Più volatile del mercato", "Non correlata al mercato"],
        ans: 1,
        exp: "Beta > 1 = più volatile. Es: Beta 1.5 → se mercato +10%, azione circa +15%.",
        time: 45,
        topic: "intermediate"
      }, {
        q: "Il dividend payout ratio è calcolato come:",
        opts: ["Dividendi / Net Income", "Net Income / Dividendi", "Dividendi × Net Income"],
        ans: 0,
        exp: "Payout Ratio = DPS/EPS = % di utili distribuiti come dividendi.",
        time: 30,
        topic: "intermediate"
      },
      // === ADVANCED (5 domande) ===
      {
        q: "Il PEG ratio considera:",
        opts: ["Solo il P/E", "P/E e tasso di crescita degli utili", "Solo i dividendi"],
        ans: 1,
        exp: "PEG = P/E / Growth rate. Aggiusta il P/E per la crescita attesa. PEG < 1 = potenzialmente sottovalutato.",
        time: 45,
        topic: "advanced"
      }, {
        q: "L'Enterprise Value (EV) include:",
        opts: ["Solo Market Cap", "Market Cap + Debito - Cash", "Solo il Debito"],
        ans: 1,
        exp: "EV = MC + Debt - Cash. Rappresenta il costo totale per acquistare l'intera azienda.",
        time: 45,
        topic: "advanced"
      }, {
        q: "Il Free Cash Flow viene usato per:",
        opts: ["Pagare solo gli interessi", "Dividendi, buyback, riduzione debito", "Solo le tasse"],
        ans: 1,
        exp: "FCF = cash disponibile DOPO investimenti. Può andare a dividendi, buyback, o debt repayment.",
        time: 45,
        topic: "advanced"
      }, {
        q: "Un'azienda con P/B < 1 è:",
        opts: ["Sempre sopravvalutata", "Potenzialmente sottovalutata", "Matematicamente impossibile"],
        ans: 1,
        exp: "P/B < 1 = prezzo < book value. Può indicare sottovalutazione, ma anche problemi finanziari.",
        time: 45,
        topic: "advanced"
      }, {
        q: "La 'diluzione' degli azionisti avviene quando:",
        opts: ["Si emettono nuove azioni", "Si pagano dividendi", "Si fa un buyback"],
        ans: 0,
        exp: "Nuove azioni emesse = più shares outstanding = ogni azione vale % minore dell'azienda = diluzione.",
        time: 45,
        topic: "advanced"
      }]
    }
  };
  const lessons = [{
    id: 1,
    name: 'Obbligazioni',
    icon: '📊',
    color: 'from-amber-400 to-orange-500'
  }, {
    id: 2,
    name: 'Azioni',
    icon: '📈',
    color: 'from-emerald-400 to-teal-500'
  }, {
    id: 3,
    name: 'ETF',
    icon: '🎯',
    color: 'from-purple-400 to-pink-500'
  }, {
    id: 4,
    name: 'Derivati',
    icon: '⚡',
    color: 'from-rose-400 to-red-500'
  }];

  // Handlers
  const startFullQuiz = questions => {
    // Start quiz with ALL questions from the lesson
    setQuizQuestions(questions);
    setQuizIndex(0);
    setQuiz(questions[0]);
    setQuizCorrect(0);
    setQuizAnswers({});
    setSelected(null);
    setAnswered(false);
    if (timerOn) setTimer(questions[0].time || 60);
  };
  const startSingleQuiz = q => {
    // Start single question (from library)
    setQuizQuestions([q]);
    setQuizIndex(0);
    setQuiz(q);
    setQuizAnswers({});
    setSelected(null);
    setAnswered(false);
    if (timerOn) setTimer(q.time || 60);
  };

  // Navigate to a specific question
  const navigateToQuestion = targetIndex => {
    if (targetIndex < 0 || targetIndex >= quizQuestions.length) return;
    setQuizIndex(targetIndex);
    setQuiz(quizQuestions[targetIndex]);

    // If already answered, restore that state
    if (quizAnswers[targetIndex]) {
      setSelected(quizAnswers[targetIndex].selected);
      setAnswered(true);
    } else {
      setSelected(null);
      setAnswered(false);
      if (timerOn) setTimer(quizQuestions[targetIndex].time || 60);
    }
  };
  const submit = () => {
    if (selected === null) return;
    setAnswered(true);
    const isCorrect = selected === quiz.ans;

    // Track this answer
    setQuizAnswers(prev => ({
      ...prev,
      [quizIndex]: {
        selected,
        isCorrect
      }
    }));
    if (isCorrect) {
      setStreak(s => s + 1);
      setQuizCorrect(c => c + 1);
    } else {
      setStreak(0);
    }
  };
  const next = () => {
    const correct = selected === quiz.ans;
    const bonus = Math.min(streak, 5) * 10;

    // Update stats for this question (only if not already counted)
    if (!quizAnswers[quizIndex]) {
      if (correct) {
        setStats(s => ({
          ...s,
          coins: s.coins + 10 + bonus,
          xp: s.xp + 20 + bonus,
          correct: s.correct + 1,
          quizzes: s.quizzes + 1
        }));
      } else {
        setStats(s => ({
          ...s,
          quizzes: s.quizzes + 1
        }));
      }
    }

    // Find next unanswered question or go to next in sequence
    let nextIdx = quizIndex + 1;

    // Check if all questions are answered
    const answeredCount = Object.keys(quizAnswers).length + (quizAnswers[quizIndex] ? 0 : 1);
    if (answeredCount >= quizQuestions.length) {
      // All questions answered - complete quiz
      const totalQuestions = quizQuestions.length;
      const finalCorrect = Object.values(quizAnswers).filter(a => a.isCorrect).length + (correct && !quizAnswers[quizIndex] ? 1 : 0);
      const percentage = Math.round(finalCorrect / totalQuestions * 100);

      // Mark lesson as completed if from home (not library)
      if (!topic && percentage >= 60) {
        setCompleted(prev => [...new Set([...prev, activeLesson])]);
        setActiveLesson(Math.min(activeLesson + 1, lessons.length));
        // Bonus for completing lesson
        setStats(s => ({
          ...s,
          coins: s.coins + 100,
          xp: s.xp + 200
        }));
      }

      // Reset quiz state
      setQuiz(null);
      setQuizQuestions([]);
      setQuizIndex(0);
      setQuizCorrect(0);
      setQuizAnswers({});
      setTimer(null);
      return;
    }

    // Go to next question in sequence
    if (nextIdx < quizQuestions.length) {
      setQuizIndex(nextIdx);
      setQuiz(quizQuestions[nextIdx]);

      // Check if already answered
      if (quizAnswers[nextIdx]) {
        setSelected(quizAnswers[nextIdx].selected);
        setAnswered(true);
      } else {
        setSelected(null);
        setAnswered(false);
        if (timerOn) setTimer(quizQuestions[nextIdx].time || 60);
      }
    }
  };
  const rateCard = rating => {
    if (cardIdx < topic.cards.length - 1) {
      setCardIdx(cardIdx + 1);
      setShowAnswer(false);
    } else {
      setStats(s => ({
        ...s,
        cards: s.cards + topic.cards.length,
        xp: s.xp + 50
      }));
      setTab('theory');
      setCardIdx(0);
      setShowAnswer(false);
    }
  };

  // ========== CHAT MANAGEMENT FUNCTIONS ==========

  // Helper function for AI responses
  // Chiamata API Anthropic reale per la chat principale
  const callMainChatAPI = async (userMessage, conversationHistory) => {
    const systemPrompt = `Sei FinLearn AI Coach 🐂, un tutor esperto per la preparazione all'esame CFA Level 1.

REGOLE:
- Rispondi SEMPRE in italiano
- Sii conciso ma completo (max 200 parole)
- Usa emoji per rendere le spiegazioni engaging
- Usa esempi pratici e mnemonici
- Spiega le formule con esempi numerici

TONO: Incoraggiante, usa "tu" informale

AREE DI COMPETENZA:
- Fixed Income (bond, duration, convexity, yield)
- Equity (P/E, EPS, valuation)
- Corporate Finance (NPV, IRR, WACC)
- Portfolio Management (CAPM, beta, diversificazione)
- Derivatives, Economics, Ethics

Rispondi in modo chiaro e pratico, come un tutor esperto.`;
    try {
      const messages = conversationHistory.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10) // Ultimi 10 messaggi per contesto
      .map(m => ({
        role: m.role,
        content: m.content
      }));
      messages.push({
        role: 'user',
        content: userMessage
      });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: systemPrompt,
          messages: messages
        })
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      return data.content.filter(block => block.type === 'text').map(block => block.text).join('\n') || 'Mi dispiace, riprova.';
    } catch (err) {
      console.error('API Error:', err);
      return '🐂 Ops! Problema di connessione. Riprova tra poco!';
    }
  };

  // Create new chat
  const createNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      title: 'Nuova conversazione',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        role: 'assistant',
        content: `🐂 Ciao${user?.displayName ? ` ${user.displayName}` : ''}! Sono il tuo AI Coach. Come posso aiutarti oggi?`,
        timestamp: new Date().toISOString()
      }]
    };
    setChats(prev => [newChat, ...prev].slice(0, 50));
    setActiveChatId(newChat.id);
    setShowChatHistory(false);
  };

  // Select existing chat
  const selectChat = chatId => {
    setActiveChatId(chatId);
    setShowChatHistory(false);
  };

  // Delete chat
  const deleteChat = (chatId, e) => {
    if (e) e.stopPropagation();
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chats.filter(c => c.id !== chatId);
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Open AI Chat from Quiz - creates new chat with quiz context
  const openQuizChat = question => {
    console.log('🎯 openQuizChat called with:', question.q.slice(0, 50));
    const newChat = {
      id: `quiz_${Date.now()}`,
      title: `Quiz: ${question.q.slice(0, 35)}...`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isQuizChat: true,
      quizQuestion: question.q,
      messages: [{
        role: 'assistant',
        content: `🐂 Stai lavorando su:\n\n"${question.q}"\n\nCome posso aiutarti? Posso spiegarti i concetti senza darti la risposta!`,
        timestamp: new Date().toISOString()
      }]
    };
    console.log('📝 Creating new quiz chat:', newChat.id);
    setChats(prev => {
      const updated = [newChat, ...prev].slice(0, 50);
      console.log('📊 Chats after add:', updated.length);
      return updated;
    });
    setQuizChatId(newChat.id);
    setShowQuizChat(true);
  };

  // Close quiz chat modal
  const closeQuizChat = () => {
    setShowQuizChat(false);
    setQuizChatId(null);
  };

  // Send message - works with chats system (now with real AI)
  const sendMsg = async () => {
    if (!msg.trim() || typing) return;
    const userMessage = {
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString()
    };

    // If no active chat, create a new one
    if (!activeChatId) {
      const newChatId = `chat_${Date.now()}`;
      const welcomeMsg = {
        role: 'assistant',
        content: `🐂 Ciao! Come posso aiutarti?`,
        timestamp: new Date().toISOString()
      };
      const newChat = {
        id: newChatId,
        title: msg.trim().slice(0, 40) + (msg.length > 40 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [welcomeMsg, userMessage]
      };
      setChats(prev => [newChat, ...prev].slice(0, 50));
      setActiveChatId(newChatId);
      const currentMsg = msg;
      setMsg('');
      setTyping(true);
      try {
        const resp = await callMainChatAPI(currentMsg, [welcomeMsg]);
        setChats(prev => prev.map(c => c.id === newChatId ? {
          ...c,
          messages: [...c.messages, {
            role: 'assistant',
            content: resp,
            timestamp: new Date().toISOString()
          }],
          updatedAt: new Date().toISOString()
        } : c));
      } catch (err) {
        console.error('Chat error:', err);
      } finally {
        setTyping(false);
      }
      return;
    }

    // Add message to existing chat
    const currentHistory = [...chat];
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const isFirstUserMsg = !c.messages.some(m => m.role === 'user');
        const newTitle = isFirstUserMsg ? msg.trim().slice(0, 40) + (msg.length > 40 ? '...' : '') : c.title;
        return {
          ...c,
          title: newTitle,
          messages: [...c.messages, userMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
    const currentMsg = msg;
    const currentChatId = activeChatId;
    setMsg('');
    setTyping(true);
    try {
      const resp = await callMainChatAPI(currentMsg, currentHistory);
      setChats(prev => prev.map(c => c.id === currentChatId ? {
        ...c,
        messages: [...c.messages, {
          role: 'assistant',
          content: resp,
          timestamp: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      } : c));
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setTyping(false);
    }
  };

  // ========== QUIZ SCREEN ==========
  if (quiz) {
    const correct = selected === quiz.ans;
    const answeredCount = Object.keys(quizAnswers).length;
    const progress = quizQuestions.length > 1 ? answeredCount / quizQuestions.length * 100 : answered ? 100 : 0;
    const canGoPrev = quizIndex > 0;
    const canGoNext = quizIndex < quizQuestions.length - 1;
    const allAnswered = answeredCount >= quizQuestions.length;
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-slate-50"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white border-b border-slate-200 sticky top-0 z-20"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-3 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setQuiz(null);
        setQuizQuestions([]);
        setQuizIndex(0);
        setQuizAnswers({});
      },
      className: "p-2 hover:bg-slate-100 rounded-full"
    }, /*#__PURE__*/React.createElement(X, {
      size: 24,
      className: "text-slate-600"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowCalc(true),
      className: "p-2 hover:bg-amber-100 rounded-full transition",
      title: "Calcolatrice"
    }, /*#__PURE__*/React.createElement(Calculator, {
      size: 20,
      className: "text-amber-600"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => openQuizChat(quiz),
      className: "p-2 hover:bg-amber-100 rounded-full transition",
      title: "Chiedi a AI Coach"
    }, /*#__PURE__*/React.createElement(MessageSquare, {
      size: 20,
      className: "text-amber-600"
    })), quizQuestions.length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold"
    }, quizIndex + 1, "/", quizQuestions.length), streak > 0 && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-bold"
    }, "\u2600\uFE0F ", streak, "x"), timerOn && timer !== null && /*#__PURE__*/React.createElement("div", {
      className: `flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${timer <= 10 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 16
    }), timer, "s")), /*#__PURE__*/React.createElement("div", {
      className: "w-10"
    })), /*#__PURE__*/React.createElement("div", {
      className: "h-1 bg-slate-200"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500",
      style: {
        width: `${progress}%`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-6"
    }, quizQuestions.length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 mb-6"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => navigateToQuestion(quizIndex - 1),
      disabled: !canGoPrev,
      className: `flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${canGoPrev ? 'bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:text-amber-600 active:scale-95 text-slate-500' : 'bg-slate-100 text-slate-300'}`
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 overflow-x-auto",
      style: {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 px-1 py-1",
      style: {
        width: 'max-content'
      }
    }, quizQuestions.map((_, idx) => {
      const a = quizAnswers[idx];
      const isCurrent = idx === quizIndex;
      return /*#__PURE__*/React.createElement("button", {
        key: idx,
        ref: el => {
          if (el && isCurrent) el.scrollIntoView({
            inline: 'center',
            block: 'nearest',
            behavior: 'smooth'
          });
        },
        onClick: () => navigateToQuestion(idx),
        className: `flex items-center justify-center rounded-lg font-bold shrink-0 transition-all duration-200 ${a ? a.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-400 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`,
        style: {
          width: 28,
          height: 28,
          fontSize: 12,
          ...(isCurrent ? {
            transform: 'scale(1.2)',
            background: a ? undefined : 'linear-gradient(135deg,#fbbf24,#f97316)',
            color: '#fff',
            boxShadow: '0 3px 10px -2px rgba(245,158,11,.55)'
          } : {})
        }
      }, idx + 1);
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: () => navigateToQuestion(quizIndex + 1),
      disabled: !canGoNext,
      className: `flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${canGoNext ? 'bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:text-amber-600 active:scale-95 text-slate-500' : 'bg-slate-100 text-slate-300'}`
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      key: quizIndex,
      className: "fl-quiz-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3 mb-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shrink-0 shadow-md",
      style: {
        fontSize: 15
      }
    }, quizIndex + 1), /*#__PURE__*/React.createElement("h2", {
      className: "text-xl font-bold text-slate-800 flex-1 pt-1"
    }, quiz.q)), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3 mb-6"
    }, quiz.opts.map((opt, i) => {
      let style = 'border-slate-200 bg-white hover:border-emerald-400';
      if (answered) {
        if (i === quiz.ans) style = 'border-emerald-500 bg-emerald-50';else if (selected === i) style = 'border-rose-500 bg-rose-50';else style = 'border-slate-200 bg-slate-50 opacity-50';
      } else if (selected === i) style = 'border-amber-500 bg-amber-50';
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => !answered && setSelected(i),
        disabled: answered,
        className: `fl-opt-in w-full p-4 rounded-xl border-2 text-left transition-all ${style}`,
        style: {
          animationDelay: `${i * 70 + 60}ms`
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-8 h-8 rounded-lg flex items-center justify-center font-bold ${answered && i === quiz.ans ? 'bg-emerald-500 text-white' : answered && selected === i ? 'bg-rose-500 text-white' : selected === i ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`
      }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
        className: "font-medium text-slate-700"
      }, opt), answered && i === quiz.ans && /*#__PURE__*/React.createElement(Check, {
        className: "ml-auto text-emerald-600",
        size: 20
      }), answered && selected === i && !correct && /*#__PURE__*/React.createElement(X, {
        className: "ml-auto text-rose-600",
        size: 20
      })));
    }))), answered && /*#__PURE__*/React.createElement("div", {
      className: `p-4 rounded-xl mb-6 ${correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement(BullMascot, {
      size: 40,
      mood: correct ? 'correct' : 'wrong'
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: `font-bold ${correct ? 'text-emerald-700' : 'text-amber-700'}`
    }, correct ? streak > 1 ? `${streak}x Streak! Sei on fire!` : 'Ottimo lavoro!' : 'Ci sei quasi, riprova!'), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600 text-sm mt-1"
    }, quiz.exp)))), !answered ? /*#__PURE__*/React.createElement("button", {
      onClick: submit,
      disabled: selected === null,
      className: `w-full py-4 rounded-xl font-bold transition-all ${selected !== null ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400'}`
    }, "VERIFICA") : allAnswered ? /*#__PURE__*/React.createElement("button", {
      onClick: next,
      className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
    }, "\uD83C\uDF31 COMPLETA QUIZ") : /*#__PURE__*/React.createElement("button", {
      onClick: next,
      className: "w-full py-4 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
    }, "CONTINUA \u2192")), showCalc && /*#__PURE__*/React.createElement(TICalculator, {
      onClose: () => setShowCalc(false)
    }), showQuizChat && quizChatId && /*#__PURE__*/React.createElement(AiChatModal, {
      onClose: closeQuizChat,
      chatId: quizChatId,
      chats: chats,
      setChats: setChats,
      currentQuestion: quiz
    }));
  }

  // ========== MOCK EXAM RENDER ==========
  if (mockExamState.active) {
    const {
      questions,
      currentIndex,
      answers,
      timeRemaining,
      results,
      flagged,
      isFullExam
    } = mockExamState;
    const currentQ = questions[currentIndex];
    const currentAnswer = answers.find(a => a.questionIndex === currentIndex);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isTimeWarning = timeRemaining < 300; // 5 min warning

    // Results Screen
    if (results) {
      return /*#__PURE__*/React.createElement("div", {
        className: "min-h-screen",
        style: {
          background: theme === 'dark' ? `linear-gradient(180deg, ${th.bg} 0%, ${th.bgSecondary} 100%)` : `linear-gradient(180deg, ${th.bg} 0%, ${th.bgSecondary} 100%)`
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "max-w-xl mx-auto px-4 py-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-center mb-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "mb-4"
      }, /*#__PURE__*/React.createElement(BullMascot, {
        size: 100,
        mood: results.passed ? 'celebrating' : 'thinking'
      })), /*#__PURE__*/React.createElement("h1", {
        className: "text-3xl font-black mb-2",
        style: {
          color: th.text
        }
      }, results.passed ? '🎉 Complimenti!' : '💪 Continua così!'), /*#__PURE__*/React.createElement("p", {
        style: {
          color: th.textMuted
        }
      }, results.passed ? 'Hai superato il Mock Exam!' : 'Serve il 70% per passare. Riprova!')), /*#__PURE__*/React.createElement("div", {
        className: "flex justify-center mb-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-40 h-40 rounded-full flex flex-col items-center justify-center ${results.passed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-5xl font-black text-white"
      }, results.percentage, "%"), /*#__PURE__*/React.createElement("span", {
        className: "text-white/80 text-sm"
      }, results.correct, "/", results.total, " corrette"))), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl p-6 mb-6 text-center",
        style: {
          backgroundColor: th.card,
          borderWidth: 1,
          borderColor: th.cardBorder
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-sm font-medium mb-2",
        style: {
          color: th.textMuted
        }
      }, "XP Guadagnati"), /*#__PURE__*/React.createElement("div", {
        className: "text-4xl font-black text-amber-500 flex items-center justify-center gap-2"
      }, /*#__PURE__*/React.createElement(Zap, {
        size: 32
      }), "+", results.xpEarned), results.passed && /*#__PURE__*/React.createElement("div", {
        className: "mt-2 text-sm text-emerald-500 font-semibold"
      }, "\uD83C\uDF81 Include +200 bonus per aver superato!")), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl p-4 mb-6",
        style: {
          backgroundColor: th.card,
          borderWidth: 1,
          borderColor: th.cardBorder
        }
      }, /*#__PURE__*/React.createElement("h3", {
        className: "font-bold mb-4 flex items-center gap-2",
        style: {
          color: th.text
        }
      }, /*#__PURE__*/React.createElement(Target, {
        size: 18,
        className: "text-amber-500"
      }), "Performance per Topic"), /*#__PURE__*/React.createElement("div", {
        className: "space-y-3"
      }, Object.entries(results.topicBreakdown).map(([topic, data]) => {
        const pct = Math.round(data.correct / data.total * 100);
        return /*#__PURE__*/React.createElement("div", {
          key: topic
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex justify-between text-sm mb-1"
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            color: th.text
          }
        }, topic), /*#__PURE__*/React.createElement("span", {
          className: pct >= 70 ? 'text-emerald-500' : 'text-amber-500'
        }, data.correct, "/", data.total, " (", pct, "%)")), /*#__PURE__*/React.createElement("div", {
          className: "h-2 rounded-full",
          style: {
            backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: `h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`,
          style: {
            width: `${pct}%`
          }
        })));
      }))), /*#__PURE__*/React.createElement("button", {
        onClick: () => setMockExamState(prev => ({
          ...prev,
          results: null,
          currentIndex: 0
        })),
        className: "w-full py-4 rounded-xl font-bold mb-3 transition",
        style: {
          backgroundColor: th.card,
          borderWidth: 1,
          borderColor: th.cardBorder,
          color: th.text
        }
      }, "\uD83D\uDCDD Rivedi Risposte"), /*#__PURE__*/React.createElement("button", {
        onClick: resetMockExam,
        className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      }, "\u2705 Torna alla Home")));
    }

    // Question Screen
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen pb-24",
      style: {
        backgroundColor: theme === 'dark' ? th.bg : '#f8fafc'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sticky top-0 z-20 backdrop-blur-sm",
      style: {
        backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        borderBottomWidth: 1,
        borderColor: th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (confirm('Vuoi davvero abbandonare? Il progresso verrà perso.')) {
          resetMockExam();
        }
      },
      className: "flex items-center gap-1 text-sm font-medium",
      style: {
        color: th.textMuted
      }
    }, /*#__PURE__*/React.createElement(X, {
      size: 18
    }), " Esci"), /*#__PURE__*/React.createElement("div", {
      className: `flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${isTimeWarning ? 'bg-rose-100 text-rose-600 animate-pulse' : ''}`,
      style: !isTimeWarning ? {
        backgroundColor: theme === 'dark' ? th.bgSecondary : '#f1f5f9',
        color: th.text
      } : {}
    }, /*#__PURE__*/React.createElement(Clock, {
      size: 16
    }), String(minutes).padStart(2, '0'), ":", String(seconds).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-semibold",
      style: {
        color: th.text
      }
    }, currentIndex + 1, "/", questions.length)), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 h-2 rounded-full",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all",
      style: {
        width: `${(currentIndex + 1) / questions.length * 100}%`
      }
    })))), /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto px-4 py-6"
    }, /*#__PURE__*/React.createElement("div", {
      key: currentIndex,
      className: "fl-quiz-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"
    }, "\uD83D\uDCDA ", currentQ.topic)), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl p-5 mb-6",
      style: {
        backgroundColor: th.card,
        borderWidth: 1,
        borderColor: th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shrink-0 shadow-md",
      style: {
        fontSize: 15
      }
    }, currentIndex + 1), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold leading-relaxed flex-1",
      style: {
        color: th.text
      }
    }, currentQ.q))), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3 mb-6"
    }, currentQ.opts.map((opt, i) => {
      const isSelected = currentAnswer?.selectedAnswer === i;
      const showCorrect = currentAnswer && i === currentQ.ans;
      const showWrong = currentAnswer && isSelected && !currentAnswer.isCorrect;
      let optStyle = {
        backgroundColor: th.card,
        borderWidth: 2,
        borderColor: th.cardBorder,
        color: th.text
      };
      if (showCorrect) {
        optStyle = {
          backgroundColor: theme === 'dark' ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
          borderWidth: 2,
          borderColor: '#10b981',
          color: '#059669'
        };
      } else if (showWrong) {
        optStyle = {
          backgroundColor: theme === 'dark' ? 'rgba(244,63,94,0.15)' : '#fef2f2',
          borderWidth: 2,
          borderColor: '#f43f5e',
          color: '#e11d48'
        };
      } else if (isSelected && !currentAnswer) {
        optStyle = {
          backgroundColor: theme === 'dark' ? 'rgba(251,191,36,0.15)' : '#fffbeb',
          borderWidth: 2,
          borderColor: '#fbbf24',
          color: th.text
        };
      }
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => !currentAnswer && submitMockAnswer(i),
        disabled: !!currentAnswer,
        className: "w-full p-4 rounded-xl text-left transition-all flex items-center gap-3",
        style: optStyle
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-rose-500 text-white' : isSelected ? 'bg-amber-500 text-white' : ''}`,
        style: !showCorrect && !showWrong && !isSelected ? {
          backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
          color: th.textMuted
        } : {}
      }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
        className: "flex-1 font-medium"
      }, opt), showCorrect && /*#__PURE__*/React.createElement(Check, {
        size: 24,
        className: "text-emerald-500"
      }), showWrong && /*#__PURE__*/React.createElement(X, {
        size: 24,
        className: "text-rose-500"
      }));
    })), currentAnswer && /*#__PURE__*/React.createElement("div", {
      className: `rounded-xl p-4 mb-6 ${currentAnswer.isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement(BullMascot, {
      size: 40,
      mood: currentAnswer.isCorrect ? 'correct' : 'wrong'
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: `font-bold mb-1 ${currentAnswer.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`
    }, currentAnswer.isCorrect ? '✓ Corretto!' : '✗ Sbagliato'), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600 text-sm"
    }, currentQ.exp)))))), /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-0 left-0 right-0 p-4",
      style: {
        backgroundColor: theme === 'dark' ? th.bg : 'white',
        borderTopWidth: 1,
        borderColor: th.cardBorder
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto"
    }, !currentAnswer ? /*#__PURE__*/React.createElement("div", {
      className: "text-center text-sm",
      style: {
        color: th.textMuted
      }
    }, "Seleziona una risposta") : currentIndex >= questions.length - 1 ? /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        // Calculate and show results
        const correct = answers.filter(a => a.isCorrect).length;
        const total = questions.length;
        const percentage = Math.round(correct / total * 100);
        const passed = percentage >= 70;
        const baseXP = isFullExam ? 1000 : 500; // Full exam = 1000 XP
        const bonusXP = passed ? isFullExam ? 500 : 200 : 0; // Full exam bonus = 500

        setStats(s => ({
          ...s,
          xp: s.xp + baseXP + bonusXP,
          totalQuizzes: s.totalQuizzes + 1,
          correctAnswers: s.correctAnswers + correct,
          totalAnswers: s.totalAnswers + total
        }));
        setMockExamState(prev => ({
          ...prev,
          results: {
            correct,
            total,
            percentage,
            passed,
            xpEarned: baseXP + bonusXP,
            topicBreakdown: calculateTopicBreakdown(answers, questions),
            isFullExam
          }
        }));
      },
      className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
    }, "\uD83C\uDFC1 ", isFullExam ? 'COMPLETA FULL EXAM' : 'COMPLETA MOCK EXAM') : /*#__PURE__*/React.createElement("button", {
      onClick: nextMockQuestion,
      className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white"
    }, "PROSSIMA DOMANDA \u2192"))), /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-20 left-0 right-0 px-4 pb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => currentIndex > 0 && setMockExamState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      })),
      disabled: currentIndex === 0,
      className: "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition disabled:opacity-30",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.text
      }
    }, /*#__PURE__*/React.createElement(ChevronLeft, {
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1 overflow-x-auto flex-1 justify-center"
    }, (() => {
      const total = questions.length;
      let start = Math.max(0, currentIndex - 2);
      let end = Math.min(total, start + 5);
      if (end - start < 5) start = Math.max(0, end - 5);
      const visibleIndices = [];
      for (let i = start; i < end; i++) visibleIndices.push(i);
      return visibleIndices.map(idx => {
        const ans = answers.find(a => a.questionIndex === idx);
        const isFlagged = flagged.includes(idx);
        return /*#__PURE__*/React.createElement("button", {
          key: idx,
          onClick: () => setMockExamState(prev => ({
            ...prev,
            currentIndex: idx
          })),
          className: `w-9 h-9 rounded-lg text-xs font-bold transition relative ${idx === currentIndex ? 'bg-amber-500 text-white ring-2 ring-amber-300' : ans?.isCorrect ? 'bg-emerald-500 text-white' : ans ? 'bg-rose-500 text-white' : ''}`,
          style: idx !== currentIndex && !ans ? {
            backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
            color: th.textMuted
          } : {}
        }, idx + 1, isFlagged && /*#__PURE__*/React.createElement("span", {
          className: "absolute -top-1 -right-1 text-xs"
        }, "\uD83D\uDEA9"));
      });
    })()), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setMockExamState(prev => ({
          ...prev,
          flagged: prev.flagged.includes(currentIndex) ? prev.flagged.filter(i => i !== currentIndex) : [...prev.flagged, currentIndex]
        }));
      },
      className: `w-10 h-10 rounded-xl flex items-center justify-center transition ${flagged.includes(currentIndex) ? 'bg-rose-500 text-white' : ''}`,
      style: !flagged.includes(currentIndex) ? {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.textMuted
      } : {}
    }, "\uD83D\uDEA9"), /*#__PURE__*/React.createElement("select", {
      value: currentIndex,
      onChange: e => setMockExamState(prev => ({
        ...prev,
        currentIndex: parseInt(e.target.value)
      })),
      className: "w-16 h-10 rounded-xl text-center text-sm font-bold appearance-none cursor-pointer",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.text
      }
    }, questions.map((_, idx) => /*#__PURE__*/React.createElement("option", {
      key: idx,
      value: idx
    }, idx + 1))), /*#__PURE__*/React.createElement("button", {
      onClick: () => currentIndex < questions.length - 1 && setMockExamState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      })),
      disabled: currentIndex === questions.length - 1,
      className: "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition disabled:opacity-30",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.text
      }
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-center gap-4 mt-2 text-xs",
      style: {
        color: th.textMuted
      }
    }, /*#__PURE__*/React.createElement("span", null, "\u2713 ", answers.filter(a => a.isCorrect).length), /*#__PURE__*/React.createElement("span", null, "\u2717 ", answers.filter(a => !a.isCorrect).length), /*#__PURE__*/React.createElement("span", null, "\u25CB ", questions.length - answers.length), flagged.length > 0 && /*#__PURE__*/React.createElement("span", null, "\uD83D\uDEA9 ", flagged.length)))));
  }

  // ========== MAIN RENDER ==========
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-24 relative",
    style: {
      background: theme === 'dark' ? '#070b14' : '#f8fafc'
    }
  }, /*#__PURE__*/React.createElement(GlobalStyles, null), theme === 'dark' && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 fl-grid-bg opacity-40 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10"
  }, section === 'home' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0",
    style: {
      background: 'radial-gradient(ellipse at 50% -40%, rgba(232,185,49,0.18) 0%, transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-x-0 bottom-0 h-28 opacity-[0.18] pointer-events-none"
  }, /*#__PURE__*/React.createElement(CandleChart, {
    className: "w-full h-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative",
    style: {
      borderBottomWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement("div", {
      className: "fl-float"
    }, /*#__PURE__*/React.createElement(level.Icon, {
      size: 46,
      className: "drop-shadow-lg"
    }));
  })(), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "fl-display fl-gold-text text-xl font-bold leading-none"
  }, "FINLEARN"), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-amber-500/80 text-[11px] font-semibold mt-1 tracking-wide"
  }, getLevelInfo(stats.xp).name.toUpperCase(), " \xB7 ", stats.xp.toLocaleString(), " XP"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold fl-glass",
    style: {
      color: '#f5d061'
    }
  }, /*#__PURE__*/React.createElement(FlameIconSVG, {
    size: 15,
    animated: stats.streak > 0
  }), " ", stats.streak), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold fl-glass",
    style: {
      color: '#f5d061'
    }
  }, /*#__PURE__*/React.createElement(StarIconSVG, {
    size: 15
  }), stats.coins)))), /*#__PURE__*/React.createElement(TickerTape, null)), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-fade-up relative overflow-hidden rounded-3xl p-5 text-white mb-6 fl-sweep",
    style: {
      background: 'linear-gradient(125deg, #b45309 0%, #f59e0b 45%, #d97706 100%)',
      boxShadow: '0 20px 50px -20px rgba(245,158,11,.55)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute -top-4 -right-4 w-32 h-32 opacity-25 fl-float"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 120,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold flex items-center gap-2 text-[15px]"
  }, /*#__PURE__*/React.createElement(Target, {
    size: 18
  }), "Il tuo progresso"), /*#__PURE__*/React.createElement("span", {
    className: "fl-mono bg-black/25 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
  }, completed.length, "/", lessons.length)), /*#__PURE__*/React.createElement("div", {
    className: "h-2.5 bg-black/25 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-white rounded-full transition-all duration-700 relative",
    style: {
      width: `${completed.length / lessons.length * 100}%`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-50/90 text-xs mt-2.5 font-medium"
  }, completed.length === 0 ? "Inizia il tuo viaggio verso il CFA Level II" : completed.length === lessons.length ? "Hai completato tutto! 🏆" : `Ancora ${lessons.length - completed.length} lezioni da completare`))), /*#__PURE__*/React.createElement("h2", {
    className: "fl-display font-bold mb-4 flex items-center gap-2 text-sm tracking-wide uppercase",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 18,
    className: "text-amber-500"
  }), "Il tuo percorso"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, lessons.map((l, i) => {
    const done = completed.includes(l.id);
    const active = l.id === activeLesson;
    const locked = l.id > activeLesson;

    // Get questions for this lesson
    const getLessonQuestions = lessonId => {
      if (lessonId === 1) return topics.bonds.questions; // 30 domande obbligazioni
      return []; // Altri topic non ancora implementati
    };
    const handleLessonClick = () => {
      if (locked) return;
      const questions = getLessonQuestions(l.id);
      if (questions.length > 0) {
        startFullQuiz(questions);
      }
    };
    return /*#__PURE__*/React.createElement("button", {
      key: l.id,
      onClick: handleLessonClick,
      disabled: locked,
      className: `fl-card-hover fl-fade-up w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${done ? 'bg-emerald-500/10 border-emerald-500/40' : active ? 'border-amber-500/60' : locked ? 'opacity-50' : ''} ${active ? 'fl-glass' : ''}`,
      style: {
        animationDelay: `${i * 60}ms`,
        backgroundColor: done ? undefined : active ? undefined : th.card,
        borderColor: done ? undefined : active ? undefined : th.cardBorder,
        boxShadow: active ? '0 0 0 1px rgba(232,185,49,.3), 0 14px 32px -16px rgba(232,185,49,.5)' : undefined
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${done ? 'bg-emerald-500' : active ? '' : ''}`,
      style: {
        background: !done && active ? 'linear-gradient(135deg, #f5d061, #d97706)' : !done && !active ? theme === 'dark' ? 'rgba(5,8,16,0.6)' : '#e2e8f0' : undefined
      }
    }, done ? /*#__PURE__*/React.createElement(Check, {
      className: "text-white",
      size: 28
    }) : locked ? /*#__PURE__*/React.createElement(Lock, {
      style: {
        color: th.textMuted
      },
      size: 24
    }) : l.icon), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 text-left"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "font-bold",
      style: {
        color: done ? '#34d399' : active ? th.text : th.textMuted
      }
    }, l.name), /*#__PURE__*/React.createElement("p", {
      className: "fl-mono text-xs font-semibold mt-0.5",
      style: {
        color: done ? '#34d399' : active ? '#f5d061' : th.textMuted
      }
    }, done ? '✓ COMPLETATO' : active ? `${getLessonQuestions(l.id).length} DOMANDE →` : 'BLOCCATO')), (active || done) && /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 rounded-2xl flex items-center justify-center",
      style: {
        background: done ? '#10b981' : 'linear-gradient(135deg, #f5d061, #d97706)'
      }
    }, /*#__PURE__*/React.createElement(Play, {
      className: "text-white ml-0.5",
      size: 18,
      fill: "white"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(TrophyIconSVG, {
    size: 24
  }), " Mock Exam Arena"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs px-3 py-1 rounded-full",
    style: {
      backgroundColor: theme === 'dark' ? 'rgba(51,65,85,0.5)' : '#f1f5f9',
      color: th.textMuted
    }
  }, "Reset tra ", getDaysUntilReset(), " giorni")), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `bg-gradient-to-r ${getUserLeague(stats.xp).color} p-4`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement(level.Icon, {
      size: 48,
      className: "drop-shadow-lg"
    });
  })(), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-white/80 text-xs"
  }, "La tua posizione"), /*#__PURE__*/React.createElement("div", {
    className: "text-white font-black text-xl"
  }, "#", getUserRank()))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-white/80 text-xs"
  }, "Lega ", getUserLeague(stats.xp).name), /*#__PURE__*/React.createElement("div", {
    className: "text-white font-bold text-lg"
  }, stats.xp, " XP")))), /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-slate-400 text-xs font-semibold mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Flame, {
    size: 14,
    className: "text-orange-400"
  }), "CLASSIFICA SETTIMANALE"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, leaderboard.slice(0, 5).map((player, idx) => {
    const isUser = player.xp <= stats.xp && (idx === 0 || leaderboard[idx - 1].xp > stats.xp);
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
    return /*#__PURE__*/React.createElement("div", {
      key: player.id,
      className: `flex items-center gap-3 p-2 rounded-xl transition-all ${isUser ? 'bg-amber-500/20 border border-amber-500/30' : 'hover:bg-white/5'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-700 text-slate-300'}`
    }, medal || idx + 1), /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl"
    }, player.avatar), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-white font-semibold text-sm"
    }, player.name), /*#__PURE__*/React.createElement("div", {
      className: "text-slate-500 text-xs"
    }, player.xp.toLocaleString(), " XP")), /*#__PURE__*/React.createElement("div", {
      className: `text-xs font-bold ${player.change > 0 ? 'text-emerald-400' : player.change < 0 ? 'text-rose-400' : 'text-slate-500'}`
    }, player.change > 0 ? `↑${player.change}` : player.change < 0 ? `↓${Math.abs(player.change)}` : '−'));
  })), getUserRank() > 5 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "text-center text-slate-600 py-2"
  }, "\u2022 \u2022 \u2022"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 p-2 rounded-xl bg-amber-500/20 border border-amber-500/30"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-slate-700 text-slate-300"
  }, getUserRank()), /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xl"
  }, stats.xp >= 2000 ? '🌳' : stats.xp >= 500 ? '🌿' : '🌱'), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-white font-semibold text-sm"
  }, "Tu"), /*#__PURE__*/React.createElement("div", {
    className: "text-slate-500 text-xs"
  }, stats.xp.toLocaleString(), " XP")), /*#__PURE__*/React.createElement("div", {
    className: "text-amber-400 text-xs font-bold"
  }, "\u2B50 TU"))))), /*#__PURE__*/React.createElement("div", {
    onClick: () => isPro ? setShowMockExamSetup(true) : setShowProModal(true),
    className: `relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${isPro ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-lg' : 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 hover:border-slate-300'}`
  }, !isPro && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
  }, /*#__PURE__*/React.createElement(Lock, {
    size: 12
  }), "PRO"), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
  }, /*#__PURE__*/React.createElement(Award, {
    size: 12
  }), "OFFICIAL"), /*#__PURE__*/React.createElement("div", {
    className: "p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-teal-500/30"
  }, /*#__PURE__*/React.createElement(Trophy, {
    size: 32,
    className: "text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-slate-800"
  }, "\uD83C\uDFC6 FULL Mock Exam"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1 text-slate-600"
  }, "180 domande \u2022 4h 30min \u2022 Come l'esame VERO"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 12
  }), "+1000 XP"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700"
  }, /*#__PURE__*/React.createElement(Target, {
    size: 12
  }), "Classifica")))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      const questions = generateFullMockExam();
      setMockExamState({
        active: true,
        loading: false,
        questions,
        currentIndex: 0,
        answers: [],
        timeRemaining: CFA_FULL_EXAM_CONFIG.timeMinutes * 60,
        sessionTopic: 'full',
        examConfig: {
          type: 'full',
          numQuestions: 180
        },
        results: null,
        error: null,
        flagged: [],
        isFullExam: true
      });
    },
    className: "w-full mt-4 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-teal-500/20"
  }, "\uD83D\uDE80 INIZIA FULL EXAM (180 Q)"))), /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-lg mt-4",
    onClick: () => setShowMockExamSetup(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 12
  }), "PRACTICE"), /*#__PURE__*/React.createElement("div", {
    className: "p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 48,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-slate-800"
  }, "\uD83D\uDCDA Practice Quiz"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-1 text-slate-600"
  }, "Scegli topic e numero domande"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 12
  }), "+500 XP")))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setShowMockExamSetup(true);
    },
    className: "w-full mt-4 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/20"
  }, "\u2699\uFE0F CONFIGURA PRACTICE"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 bg-white rounded-xl p-4 border border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 16,
    className: "text-amber-500"
  }), "Come guadagnare XP"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-emerald-400 rounded-full"
  }), "Quiz completato: +20"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-emerald-400 rounded-full"
  }), "Risposta corretta: +10"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-amber-400 rounded-full"
  }), "Streak bonus: +10/livello"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-slate-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 bg-purple-400 rounded-full"
  }), "Mock Exam: +500 \uD83D\uDC51")))))), section === 'library' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-24",
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 fl-glass",
    style: {
      borderBottom: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-2xl flex items-center justify-center fl-float",
    style: {
      background: 'linear-gradient(135deg, #f5d061, #d97706)'
    }
  }, /*#__PURE__*/React.createElement(BookOpen, {
    className: "text-white",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "fl-display font-bold text-lg",
    style: {
      color: th.text
    }
  }, "Studia"), /*#__PURE__*/React.createElement("p", {
    className: "fl-mono text-[11px] tracking-wide",
    style: {
      color: th.textMuted
    }
  }, "CFA LEVEL II \xB7 2026"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setStudyMode('curriculum');
      setTopic(null);
      setCfaTopic(null);
      setCfaModule(null);
      setCfaLOS(null);
    },
    className: `flex-1 py-2.5 px-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${studyMode === 'curriculum' ? 'text-white fl-card-hover' : ''}`,
    style: studyMode === 'curriculum' ? {
      background: 'linear-gradient(110deg, #d97706, #f59e0b)',
      boxShadow: '0 10px 24px -10px rgba(245,158,11,.5)'
    } : {
      backgroundColor: th.card,
      color: th.textMuted,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement(GraduationCap, {
    size: 16
  }), "CFA Curriculum"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setStudyMode('topics');
      setCfaTopic(null);
      setCfaModule(null);
      setCfaLOS(null);
    },
    className: `flex-1 py-2.5 px-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${studyMode === 'topics' ? 'text-white fl-card-hover' : ''}`,
    style: studyMode === 'topics' ? {
      background: 'linear-gradient(110deg, #d97706, #f59e0b)',
      boxShadow: '0 10px 24px -10px rgba(245,158,11,.5)'
    } : {
      backgroundColor: th.card,
      color: th.textMuted,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 16
  }), "Quick Topics")))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-6"
  }, eqOpen && /*#__PURE__*/React.createElement(EquityModule, {
    th: th,
    theme: theme,
    onClose: () => setEqOpen(false),
    rewarded: eqRewarded,
    markRewarded: k => setEqRewarded(p => [...p, k]),
    onReward: (xp, coins) => setStats(s => ({
      ...s,
      xp: s.xp + xp,
      coins: s.coins + coins,
      quizzes: s.quizzes + 1
    }))
  }), studyMode === 'curriculum' && /*#__PURE__*/React.createElement(React.Fragment, null, !cfaTopic && !cfaModule && !cfaLOS && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-5",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Target, {
    className: "text-white",
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold",
    style: {
      color: th.text
    }
  }, "Your Progress"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm",
    style: {
      color: th.textMuted
    }
  }, losProgress.length, "/3 LOS completed")), /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-black text-amber-500"
  }, Math.round(losProgress.length / 3 * 100), "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-2.5 rounded-full overflow-hidden",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-500 to-orange-500",
    style: {
      width: `${losProgress.length / 3 * 100}%`
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEqOpen(true),
    className: "fl-card-hover fl-sweep w-full relative overflow-hidden rounded-2xl p-5 text-left text-white",
    style: {
      background: 'linear-gradient(125deg, #b45309 0%, #f59e0b 50%, #d97706 100%)',
      boxShadow: '0 16px 40px -16px rgba(245,158,11,.55)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center overflow-hidden p-1.5"
  }, /*#__PURE__*/React.createElement("img", {
    src: EQ_LOGO,
    alt: "",
    className: "w-full h-auto select-none",
    draggable: false
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-mono font-bold",
    style: {
      fontSize: 9,
      letterSpacing: '0.2em',
      color: 'rgba(255,243,196,.9)'
    }
  }, "\u2B50 NUOVO MODULO COMPLETO"), /*#__PURE__*/React.createElement("h3", {
    className: "fl-display font-bold",
    style: {
      fontSize: 18
    }
  }, "Equity Valuation"), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-50/90 font-medium",
    style: {
      fontSize: 12
    }
  }, "Reading 22\u201327 \xB7 teoria + 180 flashcard + 65 quiz \xB7 KaTeX")), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 22,
    className: "text-white/80"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 18,
    className: "text-amber-500"
  }), "Topics"), Object.entries(CFA_CURRICULUM).map(([key, td]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setCfaTopic(td),
    className: "w-full rounded-2xl p-5 text-left transition-all hover:scale-[1.01]",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${td.color} flex items-center justify-center text-3xl shadow-lg`
  }, td.icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg",
    style: {
      color: th.text
    }
  }, td.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold"
  }, td.weight), /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, td.totalModules, " Modules"))), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 24,
    style: {
      color: th.textMuted
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10",
    style: {
      border: '1px solid rgba(251,191,36,0.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, "\uD83D\uDCA1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-amber-500 font-semibold text-sm"
  }, "Demo: 3 LOS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs mt-1",
    style: {
      color: th.textMuted
    }
  }, "Full curriculum coming soon!"))))), cfaTopic && !cfaModule && !cfaLOS && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: `rounded-2xl p-5 mb-4 bg-gradient-to-br ${cfaTopic.color}`
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCfaTopic(null),
    className: "flex items-center gap-1 text-white/80 hover:text-white mb-3 font-medium text-sm"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), "Back"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-white"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-5xl"
  }, cfaTopic.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black"
  }, cfaTopic.name), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 text-sm"
  }, cfaTopic.weight, " \xB7 ", cfaTopic.totalModules, " Modules")))), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-4 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(Layers, {
    size: 18,
    className: "text-amber-500"
  }), "Learning Modules"), cfaTopic.modules.map(m => {
    const done = losProgress.filter(id => id.startsWith(m.id)).length;
    const pct = done / m.los.length * 100;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => setCfaModule(m),
      className: "w-full rounded-xl p-4 mb-3 text-left",
      style: {
        backgroundColor: th.card,
        border: `1px solid ${pct === 100 ? '#22c55e' : th.cardBorder}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`
    }, pct === 100 ? /*#__PURE__*/React.createElement(Check, {
      size: 24
    }) : m.number), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold",
      style: {
        color: th.text
      }
    }, "LM", m.number, ": ", m.title), /*#__PURE__*/React.createElement("p", {
      className: "text-xs mt-1",
      style: {
        color: th.textMuted
      }
    }, m.los.length, " LOS \xB7 ", m.estimatedTime), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 h-1.5 rounded-full overflow-hidden",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`,
      style: {
        width: `${pct}%`
      }
    }))), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20,
      style: {
        color: th.textMuted
      }
    })));
  })), cfaModule && !cfaLOS && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4 mb-4",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCfaModule(null),
    className: "flex items-center gap-1 mb-3 font-medium text-sm",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), cfaTopic.name), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg"
  }, cfaModule.number), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold",
    style: {
      color: th.text
    }
  }, cfaModule.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, cfaModule.los.length, " LOS")))), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(Zap, {
    size: 18,
    className: "text-amber-500"
  }), "Learning Outcomes"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, cfaModule.los.map((los, idx) => {
    const done = losProgress.includes(`${cfaModule.id}-${los.id}`);
    return /*#__PURE__*/React.createElement("button", {
      key: los.id,
      onClick: () => {
        setCfaLOS({
          ...los,
          index: idx
        });
        setExpandedSection(0);
      },
      className: "w-full rounded-xl p-4 text-left",
      style: {
        backgroundColor: th.card,
        border: `1px solid ${done ? '#22c55e' : th.cardBorder}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg flex items-center justify-center font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-500'}`
    }, done ? /*#__PURE__*/React.createElement(Check, {
      size: 20
    }) : los.id.toUpperCase()), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] px-2 py-0.5 rounded font-bold ${los.importance === 'VERY HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`
    }, los.importance), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-0.5 rounded",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        color: th.textMuted
      }
    }, los.commandWord)), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium",
      style: {
        color: th.text
      }
    }, los.title)), /*#__PURE__*/React.createElement(ChevronRight, {
      size: 18,
      style: {
        color: th.textMuted
      }
    })));
  }))), cfaLOS && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCfaLOS(null),
    className: "flex items-center gap-1 font-medium",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20
  }), "LM", cfaModule.number), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-500"
  }, "LOS ", cfaLOS.id.toUpperCase(), " \xB7 ", cfaLOS.index + 1, "/", cfaModule.los.length)), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-5 mb-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-2 py-1 rounded bg-white/20"
  }, cfaLOS.commandWord), /*#__PURE__*/React.createElement("span", {
    className: `text-xs font-bold px-2 py-1 rounded ${cfaLOS.importance === 'VERY HIGH' ? 'bg-rose-500' : 'bg-white/30'}`
  }, cfaLOS.importance), losProgress.includes(`${cfaModule.id}-${cfaLOS.id}`) && /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-2 py-1 rounded bg-emerald-500 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 12
  }), "Done")), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, cfaLOS.title)), cfaLOS.content.introduction && /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-4",
    style: {
      backgroundColor: 'rgba(251,191,36,0.1)',
      border: '1px solid rgba(251,191,36,0.2)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm",
    style: {
      color: th.text
    }
  }, cfaLOS.content.introduction)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 mb-5"
  }, cfaLOS.content.sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-xl overflow-hidden",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${expandedSection === i ? '#f59e0b' : th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpandedSection(expandedSection === i ? -1 : i),
    className: "w-full p-4 flex items-center gap-3 text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-amber-500 flex-1"
  }, s.title), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 20,
    className: `transition-transform ${expandedSection === i ? 'rotate-90' : ''}`,
    style: {
      color: th.textMuted
    }
  })), expandedSection === i && /*#__PURE__*/React.createElement("div", {
    className: "px-4 pb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-px mb-4",
    style: {
      backgroundColor: th.cardBorder
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm whitespace-pre-line",
    style: {
      color: th.text
    }
  }, s.content))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-4",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-amber-500 mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Target, {
    size: 18
  }), "Key Points"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, cfaLOS.keyPoints.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-start gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"
  }, /*#__PURE__*/React.createElement(Check, {
    size: 12,
    className: "text-emerald-500"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-sm",
    style: {
      color: th.text
    }
  }, p))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10",
    style: {
      border: '1px solid rgba(251,191,36,0.3)'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-amber-500 mb-3 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Award, {
    size: 18
  }), "Exam Tips"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, cfaLOS.examTips.map((t, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: "text-sm",
    style: {
      color: th.text
    }
  }, t)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const id = `${cfaModule.id}-${cfaLOS.id}`;
      if (!losProgress.includes(id)) setLosProgress([...losProgress, id]);
      if (cfaLOS.index < cfaModule.los.length - 1) {
        setCfaLOS({
          ...cfaModule.los[cfaLOS.index + 1],
          index: cfaLOS.index + 1
        });
        setExpandedSection(0);
      } else setCfaLOS(null);
    },
    className: `w-full py-4 rounded-xl font-bold text-white text-lg ${losProgress.includes(`${cfaModule.id}-${cfaLOS.id}`) ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`
  }, losProgress.includes(`${cfaModule.id}-${cfaLOS.id}`) ? '✅ ' : '✓ ', cfaLOS.index < cfaModule.los.length - 1 ? 'Complete & Next →' : 'Complete LOS'), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (cfaLOS.index > 0) {
        setCfaLOS({
          ...cfaModule.los[cfaLOS.index - 1],
          index: cfaLOS.index - 1
        });
        setExpandedSection(0);
      }
    },
    disabled: cfaLOS.index === 0,
    className: "flex-1 py-3 rounded-xl font-semibold disabled:opacity-30",
    style: {
      backgroundColor: th.card,
      color: th.text,
      border: `1px solid ${th.cardBorder}`
    }
  }, "\u2190 Previous"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (cfaLOS.index < cfaModule.los.length - 1) {
        setCfaLOS({
          ...cfaModule.los[cfaLOS.index + 1],
          index: cfaLOS.index + 1
        });
        setExpandedSection(0);
      }
    },
    disabled: cfaLOS.index >= cfaModule.los.length - 1,
    className: "flex-1 py-3 rounded-xl font-semibold disabled:opacity-30",
    style: {
      backgroundColor: th.card,
      color: th.text,
      border: `1px solid ${th.cardBorder}`
    }
  }, "Next \u2192")))), studyMode === 'topics' && /*#__PURE__*/React.createElement(React.Fragment, null, !topic ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, Object.values(topics).map(tp => /*#__PURE__*/React.createElement("button", {
    key: tp.id,
    onClick: () => setTopic(tp),
    className: "w-full rounded-2xl text-left overflow-hidden group",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, tp.image && /*#__PURE__*/React.createElement("div", {
    className: "relative h-32 overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: tp.image,
    alt: tp.title,
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0",
    style: {
      background: theme === 'dark' ? 'linear-gradient(to top, rgba(15,23,42,1), transparent)' : 'linear-gradient(to top, rgba(255,255,255,1), transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-3 left-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, tp.icon))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex items-center gap-3"
  }, !tp.image && /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, tp.icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg",
    style: {
      color: th.text
    }
  }, tp.title), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 12,
    className: "inline mr-1"
  }), tp.time), /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, tp.theory?.length || 0, " lessons"))), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 20,
    style: {
      color: th.textMuted
    }
  }))))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setTopic(null);
      setTab('theory');
    },
    className: "flex items-center gap-1 mb-4 font-medium",
    style: {
      color: th.textMuted
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20
  }), "Back"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-4xl"
  }, topic.icon), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold",
    style: {
      color: th.text
    }
  }, topic.title)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-6"
  }, ['theory', 'cards', 'quiz'].map(tb => /*#__PURE__*/React.createElement("button", {
    key: tb,
    onClick: () => {
      setTab(tb);
      if (tb === 'cards') {
        setCardIdx(0);
        setShowAnswer(false);
      }
    },
    className: `px-4 py-2 rounded-lg text-sm font-semibold ${tab === tb ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}`,
    style: tab !== tb ? {
      backgroundColor: th.card,
      color: th.textMuted
    } : {}
  }, tb === 'theory' ? '📖 Theory' : tb === 'cards' ? '🧠 Cards' : '✍️ Quiz'))), tab === 'theory' && topic.theory && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, topic.theory.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-xl p-5",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-2",
    style: {
      color: th.text
    }
  }, i + 1, ". ", s.title), /*#__PURE__*/React.createElement("p", {
    className: "whitespace-pre-line",
    style: {
      color: th.textMuted
    }
  }, s.content)))), tab === 'cards' && topic.cards && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm",
    style: {
      color: th.textMuted
    }
  }, "Card ", cardIdx + 1, "/", topic.cards.length)), /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowAnswer(!showAnswer),
    className: "bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white min-h-[250px] cursor-pointer"
  }, !showAnswer ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-amber-200 text-sm mb-3"
  }, "QUESTION"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold"
  }, topic.cards[cardIdx].front)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-amber-200 text-sm mb-2"
  }, "ANSWER"), /*#__PURE__*/React.createElement("p", null, topic.cards[cardIdx].back))), showAnswer && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAnswer(false);
      setCardIdx(Math.min(cardIdx + 1, topic.cards.length - 1));
    },
    className: "py-3 rounded-xl bg-rose-100 text-rose-700 font-semibold"
  }, "Hard"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAnswer(false);
      setCardIdx(Math.min(cardIdx + 1, topic.cards.length - 1));
    },
    className: "py-3 rounded-xl bg-amber-100 text-amber-700 font-semibold"
  }, "Ok"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAnswer(false);
      setCardIdx(Math.min(cardIdx + 1, topic.cards.length - 1));
    },
    className: "py-3 rounded-xl bg-emerald-100 text-emerald-700 font-semibold"
  }, "Easy"))), tab === 'quiz' && topic.questions && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, topic.questions.slice(0, 5).map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rounded-xl p-4",
    style: {
      backgroundColor: th.card,
      border: `1px solid ${th.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-medium mb-3",
    style: {
      color: th.text
    }
  }, "Q", i + 1, ": ", q.q), /*#__PURE__*/React.createElement("button", {
    onClick: () => startSingleQuiz(q),
    className: "px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold"
  }, "Start \u2192")))))))), section === 'ai' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col",
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fl-glass",
    style: {
      borderBottomWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-2xl flex items-center justify-center fl-float",
    style: {
      background: 'linear-gradient(135deg, #f5d061, #d97706)'
    }
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 32,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "fl-display font-bold text-lg",
    style: {
      color: th.text
    }
  }, "AI Coach"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, "Il tuo tutor finanziario"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowChatHistory(true),
    className: "p-2 rounded-lg relative transition",
    style: {
      backgroundColor: theme === 'dark' ? th.bgSecondary : '#f1f5f9'
    },
    title: "Cronologia chat"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 20,
    style: {
      color: th.textMuted
    }
  }), chats.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
  }, chats.length)), /*#__PURE__*/React.createElement("button", {
    onClick: createNewChat,
    className: "p-2 bg-amber-100 hover:bg-amber-200 rounded-lg",
    title: "Nuova chat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-600 text-xl font-bold"
  }, "+"))))), !activeChatId && chats.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 mb-6"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 96,
    mood: "celebrating"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-2",
    style: {
      color: th.text
    }
  }, "Benvenuto in AI Coach!"), /*#__PURE__*/React.createElement("p", {
    className: "text-center mb-6",
    style: {
      color: th.textMuted
    }
  }, "Il tuo tutor finanziario personale per la preparazione CFA"), /*#__PURE__*/React.createElement("button", {
    onClick: createNewChat,
    className: "px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
  }, "Inizia una conversazione")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto max-w-xl mx-auto w-full px-4 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, chat.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-amber-500 text-white' : ''}`,
    style: m.role !== 'user' ? {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder,
      color: th.text
    } : {}
  }, m.content))), typing && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.1s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-amber-400 rounded-full animate-bounce",
    style: {
      animationDelay: '0.2s'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4",
    style: {
      backgroundColor: th.card,
      borderTopWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: msg,
    onChange: e => setMsg(e.target.value),
    onKeyDown: e => e.key === 'Enter' && sendMsg(),
    placeholder: "Chiedimi qualcosa...",
    className: "flex-1 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-300",
    style: {
      backgroundColor: theme === 'dark' ? th.bgSecondary : '#f1f5f9',
      color: th.text
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendMsg,
    disabled: !msg.trim(),
    className: `px-4 py-3 rounded-xl transition-all ${msg.trim() ? 'bg-amber-500 text-white' : ''}`,
    style: !msg.trim() ? {
      backgroundColor: theme === 'dark' ? th.bgSecondary : '#e2e8f0',
      color: th.textMuted
    } : {}
  }, /*#__PURE__*/React.createElement(Send, {
    size: 20
  }))))), showChatHistory && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/50",
    onClick: () => setShowChatHistory(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative ml-auto w-80 max-w-full bg-white h-full shadow-2xl flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-slate-800"
  }, "Cronologia"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, chats.length, " conversazioni")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowChatHistory(false),
    className: "p-2 hover:bg-white/50 rounded-lg"
  }, /*#__PURE__*/React.createElement(X, {
    size: 20,
    className: "text-slate-500"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto"
  }, chats.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center text-slate-400 py-12"
  }, /*#__PURE__*/React.createElement(MessageSquare, {
    size: 40,
    className: "mx-auto mb-3 opacity-50"
  }), /*#__PURE__*/React.createElement("p", null, "Nessuna conversazione")) : /*#__PURE__*/React.createElement("div", {
    className: "p-2 space-y-1"
  }, chats.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    onClick: () => selectChat(c.id),
    className: `p-3 rounded-xl cursor-pointer group transition-all ${c.id === activeChatId ? 'bg-amber-100 border border-amber-300' : 'hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: `font-medium truncate text-sm flex items-center gap-1.5 ${c.id === activeChatId ? 'text-amber-700' : 'text-slate-700'}`
  }, c.isQuizChat ? /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDD") : /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC"), c.title), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 mt-1 ml-5"
  }, new Date(c.updatedAt).toLocaleDateString('it'), " \u2022 ", c.messages?.length || 0, " msg")), /*#__PURE__*/React.createElement("button", {
    onClick: e => deleteChat(c.id, e),
    className: "opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition"
  }, /*#__PURE__*/React.createElement(X, {
    size: 14,
    className: "text-red-500"
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-t bg-slate-50"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: createNewChat,
    className: "w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
  }, "+ Nuova Conversazione"))))), section === 'profile' && /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen",
    style: {
      background: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-8 pb-16 px-4 text-center text-white relative overflow-hidden",
    style: {
      background: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #d97706 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-4 left-4 fl-float"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 60,
    mood: "happy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-4 right-4 fl-float",
    style: {
      animationDelay: '1s'
    }
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 80,
    mood: "celebrating"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, user?.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: user.photoURL,
    className: "w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white/30 shadow-xl",
    alt: ""
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 mx-auto mb-3"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement(level.Icon, {
      size: 96,
      className: "drop-shadow-xl"
    });
  })()), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold"
  }, user?.displayName || 'Trader'), /*#__PURE__*/React.createElement("p", {
    className: "text-amber-100 text-sm"
  }, user?.email), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mt-2"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    return /*#__PURE__*/React.createElement("span", {
      className: `inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium`
    }, level.name, " \u2022 ", stats.xp.toLocaleString(), " XP");
  })()))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 -mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-4"
  }, [{
    icon: StarIconSVG,
    label: 'Coins',
    value: stats.coins,
    color: 'amber'
  }, {
    icon: Zap,
    label: 'XP',
    value: stats.xp,
    color: 'orange'
  }, {
    icon: Target,
    label: 'Accuracy',
    value: `${stats.quizzes ? Math.round(stats.correct / stats.quizzes * 100) : 0}%`,
    color: 'emerald'
  }, {
    icon: Brain,
    label: 'Flashcards',
    value: stats.cards,
    color: 'purple'
  }].map(({
    icon: Icon,
    label,
    value,
    color
  }) => /*#__PURE__*/React.createElement("div", {
    key: label,
    className: "rounded-xl p-4 shadow-lg",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center`
  }, typeof Icon === 'function' && Icon.toString().includes('svg') ? /*#__PURE__*/React.createElement(Icon, {
    size: 18
  }) : /*#__PURE__*/React.createElement(Icon, {
    size: 18,
    className: `text-${color}-400`
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.textMuted
    },
    className: "text-sm"
  }, label)), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold",
    style: {
      color: th.text
    }
  }, typeof value === 'number' ? value.toLocaleString() : value)))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 shadow-lg mb-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 18,
    className: "text-amber-500"
  }), "Il tuo livello"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, (() => {
    const level = getLevelInfo(stats.xp);
    const nextLevel = stats.xp < 500 ? {
      name: 'Trader',
      xp: 500
    } : stats.xp < 2000 ? {
      name: 'Wolf',
      xp: 2000
    } : stats.xp < 5000 ? {
      name: 'Bull',
      xp: 5000
    } : null;
    const prevXp = stats.xp < 500 ? 0 : stats.xp < 2000 ? 500 : stats.xp < 5000 ? 2000 : 5000;
    const progress = nextLevel ? (stats.xp - prevXp) / (nextLevel.xp - prevXp) * 100 : 100;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(level.Icon, {
      size: 50
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-sm mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium",
      style: {
        color: th.text
      }
    }, level.name), nextLevel && /*#__PURE__*/React.createElement("span", {
      style: {
        color: th.textMuted
      }
    }, nextLevel.xp - stats.xp, " XP per ", nextLevel.name)), /*#__PURE__*/React.createElement("div", {
      className: "h-3 rounded-full overflow-hidden",
      style: {
        backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full bg-gradient-to-r ${level.color} rounded-full transition-all`,
      style: {
        width: `${progress}%`
      }
    }))));
  })())), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 shadow-lg mb-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(BarChart3, {
    size: 18,
    className: "text-emerald-500"
  }), "Le tue statistiche"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.textMuted
    }
  }, "Quiz completati"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold",
    style: {
      color: th.text
    }
  }, stats.quizzes)), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full",
    style: {
      width: `${Math.min(stats.quizzes / 50 * 100, 100)}%`
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.textMuted
    }
  }, "Corrette"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-emerald-500"
  }, stats.correct, "/", stats.quizzes)), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-emerald-500 rounded-full",
    style: {
      width: stats.quizzes ? `${stats.correct / stats.quizzes * 100}%` : '0%'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 shadow-lg mb-4",
    style: {
      backgroundColor: th.card,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold mb-3 flex items-center gap-2",
    style: {
      color: th.text
    }
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 18,
    className: "text-purple-500"
  }), "Impostazioni"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between py-3",
    style: {
      borderBottomWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 20,
    className: "text-amber-400"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-medium",
    style: {
      color: th.text
    }
  }, "Timer Quiz"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs",
    style: {
      color: th.textMuted
    }
  }, "Tempo limitato per rispondere"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTimerOn(!timerOn),
    className: `w-14 h-8 rounded-full transition-all ${timerOn ? 'bg-amber-500' : ''}`,
    style: {
      backgroundColor: timerOn ? undefined : theme === 'dark' ? '#475569' : '#cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-6 h-6 bg-white rounded-full shadow transition-all ${timerOn ? 'translate-x-7' : 'translate-x-1'}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`
  }, theme === 'dark' ? /*#__PURE__*/React.createElement(Moon, {
    size: 20,
    className: "text-purple-400"
  }) : /*#__PURE__*/React.createElement(Sun, {
    size: 20,
    className: "text-amber-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: th.text
    },
    className: "font-medium"
  }, theme === 'dark' ? 'Tema Scuro' : 'Tema Chiaro'), /*#__PURE__*/React.createElement("p", {
    style: {
      color: th.textMuted
    },
    className: "text-xs"
  }, theme === 'dark' ? 'Risparmia batteria' : 'Più leggibile di giorno'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 rounded-full p-1",
    style: {
      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('dark'),
    className: `p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-purple-500 text-white' : ''}`,
    style: {
      color: theme !== 'dark' ? th.textMuted : undefined
    }
  }, /*#__PURE__*/React.createElement(Moon, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme('light'),
    className: `p-2 rounded-full transition-all ${theme === 'light' ? 'bg-amber-500 text-white' : ''}`,
    style: {
      color: theme !== 'light' ? th.textMuted : undefined
    }
  }, /*#__PURE__*/React.createElement(Sun, {
    size: 16
  }))))), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold shadow-lg transition mb-4",
    style: {
      backgroundColor: th.card,
      color: th.textMuted,
      borderWidth: 1,
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement(LogOut, {
    size: 20
  }), "Esci dall'account"))), /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto fl-glass rounded-2xl px-2 py-2 flex justify-around pointer-events-auto shadow-2xl",
    style: {
      boxShadow: '0 16px 40px -16px rgba(0,0,0,.7)'
    }
  }, [{
    id: 'home',
    icon: Home,
    label: 'Home'
  }, {
    id: 'library',
    icon: BookOpen,
    label: 'Studia'
  }, {
    id: 'ai',
    icon: MessageSquare,
    label: 'AI Coach'
  }, {
    id: 'profile',
    icon: User,
    label: 'Profilo'
  }].map(({
    id,
    icon: Icon,
    label
  }) => {
    const isActive = section === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setSection(id),
      className: "relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all",
      style: {
        color: isActive ? '#f5d061' : th.textMuted
      }
    }, isActive && /*#__PURE__*/React.createElement("span", {
      className: "absolute inset-0 rounded-xl",
      style: {
        background: 'rgba(232,185,49,0.12)',
        boxShadow: 'inset 0 0 0 1px rgba(232,185,49,.25)'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      size: 21,
      className: "relative",
      strokeWidth: isActive ? 2.5 : 2
    }), /*#__PURE__*/React.createElement("span", {
      className: `relative text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`
    }, label));
  }))), showCalc && /*#__PURE__*/React.createElement(TICalculator, {
    onClose: () => setShowCalc(false)
  }), showProModal && /*#__PURE__*/React.createElement(ProModal, {
    onClose: () => setShowProModal(false),
    onUpgrade: () => {
      setIsPro(true);
      setShowProModal(false);
      // In produzione qui andresti a Stripe/payment
      alert('🎉 Congratulazioni! Sei ora un utente PRO!\n\n(In produzione, qui ci sarebbe il pagamento con Stripe)');
    }
  }), showMockExamSetup && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
    onClick: () => !mockExamState.loading && setShowMockExamSetup(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-3xl overflow-hidden shadow-2xl",
    style: {
      backgroundColor: th.card
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(BullMascot, {
    size: 48,
    mood: "happy"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black"
  }, "AI Mock Exam"), /*#__PURE__*/React.createElement("p", {
    className: "text-white/80 text-sm"
  }, "Configura il tuo esame personalizzato"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => !mockExamState.loading && setShowMockExamSetup(false),
    className: "p-2 hover:bg-white/20 rounded-full transition"
  }, /*#__PURE__*/React.createElement(X, {
    size: 24
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 max-h-[60vh] overflow-y-auto"
  }, mockExamState.error && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 p-4 bg-rose-100 border border-rose-300 rounded-xl text-rose-700 text-sm"
  }, "\u26A0\uFE0F ", mockExamState.error), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\uD83D\uDCDD Numero Domande"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, [5, 10, 20, 30].map(num => /*#__PURE__*/React.createElement("button", {
    key: num,
    onClick: () => setMockExamConfig(c => ({
      ...c,
      numQuestions: num
    })),
    className: `py-3 rounded-xl font-bold transition ${mockExamConfig.numQuestions === num ? 'bg-amber-500 text-white' : ''}`,
    style: mockExamConfig.numQuestions !== num ? {
      backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
      color: th.text
    } : {}
  }, num)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\u23F1\uFE0F Tempo Limite"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, [{
    min: 10,
    label: '10 min'
  }, {
    min: 15,
    label: '15 min'
  }, {
    min: 30,
    label: '30 min'
  }, {
    min: 60,
    label: '1 ora'
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.min,
    onClick: () => setMockExamConfig(c => ({
      ...c,
      timeLimit: t.min
    })),
    className: `py-3 rounded-xl font-bold text-sm transition ${mockExamConfig.timeLimit === t.min ? 'bg-amber-500 text-white' : ''}`,
    style: mockExamConfig.timeLimit !== t.min ? {
      backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
      color: th.text
    } : {}
  }, t.label)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\uD83D\uDCAA Difficolt\xE0"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    level: 1,
    label: 'Facile',
    emoji: '🌱'
  }, {
    level: 2,
    label: 'Medio',
    emoji: '🔥'
  }, {
    level: 3,
    label: 'Difficile',
    emoji: '💀'
  }].map(d => /*#__PURE__*/React.createElement("button", {
    key: d.level,
    onClick: () => setMockExamConfig(c => ({
      ...c,
      difficulty: d.level
    })),
    className: `py-3 rounded-xl font-bold text-sm transition ${mockExamConfig.difficulty === d.level ? 'bg-amber-500 text-white' : ''}`,
    style: mockExamConfig.difficulty !== d.level ? {
      backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
      color: th.text
    } : {}
  }, d.emoji, " ", d.label)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-bold mb-2",
    style: {
      color: th.text
    }
  }, "\uD83D\uDCDA Topics (min 1)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 max-h-48 overflow-y-auto"
  }, CFA_TOPICS.map(topic => {
    const isSelected = mockExamConfig.selectedTopics.some(t => t.id === topic.id);
    return /*#__PURE__*/React.createElement("button", {
      key: topic.id,
      onClick: () => {
        setMockExamConfig(c => ({
          ...c,
          selectedTopics: isSelected ? c.selectedTopics.filter(t => t.id !== topic.id) : [...c.selectedTopics, topic]
        }));
      },
      className: `p-3 rounded-xl text-left transition text-sm ${isSelected ? 'bg-amber-500 text-white' : ''}`,
      style: !isSelected ? {
        backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
        color: th.text
      } : {}
    }, /*#__PURE__*/React.createElement("span", {
      className: "mr-2"
    }, topic.icon), topic.name.split(' ')[0]);
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs mt-2",
    style: {
      color: th.textMuted
    }
  }, mockExamConfig.selectedTopics.length, " topic selezionati")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl p-4 mb-6",
    style: {
      backgroundColor: theme === 'dark' ? 'rgba(251,191,36,0.1)' : '#fffbeb'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-bold text-amber-700 mb-2"
  }, "\uD83D\uDCCB Riepilogo"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-amber-600 space-y-1"
  }, /*#__PURE__*/React.createElement("p", null, "\u2022 ", mockExamConfig.numQuestions, " domande generate da AI"), /*#__PURE__*/React.createElement("p", null, "\u2022 Tempo: ", mockExamConfig.timeLimit, " minuti"), /*#__PURE__*/React.createElement("p", null, "\u2022 Difficolt\xE0: ", mockExamConfig.difficulty === 1 ? 'Facile' : mockExamConfig.difficulty === 2 ? 'Media' : 'Difficile'), /*#__PURE__*/React.createElement("p", null, "\u2022 Topics: ", mockExamConfig.selectedTopics.map(t => t.name.split(' ')[0]).join(', '))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t",
    style: {
      borderColor: th.cardBorder
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (mockExamConfig.selectedTopics.length === 0) {
        alert('Seleziona almeno un topic!');
        return;
      }
      startMockExam({
        numQuestions: mockExamConfig.numQuestions,
        timeLimit: mockExamConfig.timeLimit,
        selectedTopics: mockExamConfig.selectedTopics,
        difficulty: mockExamConfig.difficulty
      });
      setShowMockExamSetup(false);
    },
    disabled: mockExamConfig.selectedTopics.length === 0,
    className: "w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-50 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Play, {
    size: 20
  }), "INIZIA MOCK EXAM"))))));
}

// ========== ROOT APP WITH AUTH ==========
export default function FinLearn() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Splash screen - show once per session
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('finlearn_splash_shown')) return false;
    if (typeof window !== 'undefined') sessionStorage.setItem('finlearn_splash_shown', 'true');
    return true;
  });
  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const data = mockDb.getData(firebaseUser.uid);
        if (data) {
          setUserData(data);
        } else {
          const newData = {
            stats: {
              xp: 0,
              coins: 0,
              level: 1,
              streak: 0,
              quizzes: 0,
              correct: 0,
              cards: 0
            },
            completedLessons: [],
            activeLesson: 1,
            settings: {
              timerEnabled: false
            }
          };
          mockDb.setData(firebaseUser.uid, newData);
          setUserData(newData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const handleAuth = (firebaseUser, data) => {
    setUser(firebaseUser);
    setUserData(data);
  };
  const handleLogout = async () => {
    await mockAuth.signOut();
    setUser(null);
    setUserData(null);
  };
  const handleSaveProgress = data => {
    if (user) {
      mockDb.setData(user.uid, data);
    }
  };

  // Show splash first
  if (showSplash) return /*#__PURE__*/React.createElement(SplashScreen, {
    onComplete: () => setShowSplash(false)
  });
  if (loading) return /*#__PURE__*/React.createElement(LoadingScreen, null);
  if (!user) return /*#__PURE__*/React.createElement(AuthScreen, {
    onAuth: handleAuth
  });
  return /*#__PURE__*/React.createElement(MainApp, {
    user: user,
    userData: userData,
    onLogout: handleLogout,
    onSaveProgress: handleSaveProgress
  });
}
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(FinLearn));