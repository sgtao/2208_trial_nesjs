// CpuOpcodes.js

// Interrups
var CPU_INTS = {
  NMI: { id: 0, addr: 0xfffa },
  RESET: { id: 1, addr: 0xfffc },
  IRQ: { id: 2, addr: 0xfffe },
  BRK: { id: 3, addr: 0xfffe }, // not interrupt but instruction
};

// Instructions
var CPU_INSTRUCTIONS = {
  INV: { id: 0, name: 'inv' }, // Invalid
  ADC: { id: 1, name: 'adc' },
  AND: { id: 2, name: 'and' },
  ASL: { id: 3, name: 'asl' },
  BCC: { id: 4, name: 'bcc' },
  BCS: { id: 5, name: 'bcs' },
  BEQ: { id: 6, name: 'beq' },
  BIT: { id: 7, name: 'bit' },
  BMI: { id: 8, name: 'bmi' },
  BNE: { id: 9, name: 'bne' },
  BPL: { id: 10, name: 'bpl' },
  BRK: { id: 11, name: 'brk' },
  BVC: { id: 12, name: 'bvc' },
  BVS: { id: 13, name: 'bvs' },
  CLC: { id: 14, name: 'clc' },
  CLD: { id: 15, name: 'cld' },
  CLI: { id: 16, name: 'cli' },
  CLV: { id: 17, name: 'clv' },
  CMP: { id: 18, name: 'cmp' },
  CPX: { id: 19, name: 'cpx' },
  CPY: { id: 20, name: 'cpy' },
  DEC: { id: 21, name: 'dec' },
  DEX: { id: 22, name: 'dex' },
  DEY: { id: 23, name: 'dey' },
  EOR: { id: 24, name: 'eor' },
  INC: { id: 25, name: 'inc' },
  INX: { id: 26, name: 'inx' },
  INY: { id: 27, name: 'iny' },
  JMP: { id: 28, name: 'jmp' },
  JSR: { id: 29, name: 'jsr' },
  LDA: { id: 30, name: 'lda' },
  LDX: { id: 31, name: 'ldx' },
  LDY: { id: 32, name: 'ldy' },
  LSR: { id: 33, name: 'lsr' },
  NOP: { id: 34, name: 'nop' },
  ORA: { id: 35, name: 'ora' },
  PHA: { id: 36, name: 'pha' },
  PHP: { id: 37, name: 'php' },
  PLA: { id: 38, name: 'pla' },
  PLP: { id: 39, name: 'plp' },
  ROL: { id: 40, name: 'rol' },
  ROR: { id: 41, name: 'ror' },
  RTI: { id: 42, name: 'rti' },
  RTS: { id: 43, name: 'rts' },
  SBC: { id: 44, name: 'sbc' },
  SEC: { id: 45, name: 'sec' },
  SED: { id: 46, name: 'sed' },
  SEI: { id: 47, name: 'sei' },
  STA: { id: 48, name: 'sta' },
  STX: { id: 49, name: 'stx' },
  STY: { id: 50, name: 'sty' },
  TAX: { id: 51, name: 'tax' },
  TAY: { id: 52, name: 'tay' },
  TSX: { id: 53, name: 'tsx' },
  TXA: { id: 54, name: 'txa' },
  TXS: { id: 55, name: 'txs' },
  TYA: { id: 56, name: 'tya' },
};

// Addressing modes

var CPU_ADDRESSINGS = {
  IMMEDIATE: { id: 0, pc: 2, name: 'immediate' },
  ABSOLUTE: { id: 1, pc: 3, name: 'absolute' },
  INDEXED_ABSOLUTE_X: { id: 2, pc: 3, name: 'indexed_absolute_x' },
  INDEXED_ABSOLUTE_Y: { id: 3, pc: 3, name: 'indexed_absolute_y' },
  ZERO_PAGE: { id: 4, pc: 2, name: 'zero_page' },
  INDEXED_ZERO_PAGE_X: { id: 5, pc: 2, name: 'indexed_zero_page_x' },
  INDEXED_ZERO_PAGE_Y: { id: 6, pc: 2, name: 'indexed_zero_page_y' },
  IMPLIED: { id: 7, pc: 1, name: 'implied' },
  ACCUMULATOR: { id: 8, pc: 1, name: 'accumulator' },
  INDIRECT: { id: 9, pc: 3, name: 'indirect' },
  INDEXED_INDIRECT_X: { id: 10, pc: 2, name: 'indexed_indirect_x' },
  INDEXED_INDIRECT_Y: { id: 11, pc: 2, name: 'indexed_indirect_y' },
  RELATIVE: { id: 12, pc: 2, name: 'relative' },
};

// Operations (the combinations of interuction and addressing mode)
// Decoding in advance because it's much easier than implementing decoder.
var CPU_OPS = {
  0x00: {
    instruction: CPU_INSTRUCTIONS.BRK,
    cycle: 7,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x01: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0x02: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x03: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x04: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x05: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x06: {
    instruction: CPU_INSTRUCTIONS.ASL,
    cycle: 5,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x07: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x08: {
    instruction: CPU_INSTRUCTIONS.PHP,
    cycle: 3,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x09: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0x0a: {
    instruction: CPU_INSTRUCTIONS.ASL,
    cycle: 2,
    mode: CPU_ADDRESSINGS.ACCUMULATOR,
  },
  0x0b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x0c: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x0d: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x0e: {
    instruction: CPU_INSTRUCTIONS.ASL,
    cycle: 6,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x0f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x10: {
    instruction: CPU_INSTRUCTIONS.BPL,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0x11: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0x12: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x13: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x14: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x15: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x16: {
    instruction: CPU_INSTRUCTIONS.ASL,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x17: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x18: {
    instruction: CPU_INSTRUCTIONS.CLC,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x19: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0x1a: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x1b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x1c: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x1d: {
    instruction: CPU_INSTRUCTIONS.ORA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x1e: {
    instruction: CPU_INSTRUCTIONS.ASL,
    cycle: 7,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x1f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x20: {
    instruction: CPU_INSTRUCTIONS.JSR,
    cycle: 0,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x21: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0x22: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x23: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x24: {
    instruction: CPU_INSTRUCTIONS.BIT,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x25: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x26: {
    instruction: CPU_INSTRUCTIONS.ROL,
    cycle: 5,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x27: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x28: {
    instruction: CPU_INSTRUCTIONS.PLP,
    cycle: 4,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x29: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0x2a: {
    instruction: CPU_INSTRUCTIONS.ROL,
    cycle: 2,
    mode: CPU_ADDRESSINGS.ACCUMULATOR,
  },
  0x2b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x2c: {
    instruction: CPU_INSTRUCTIONS.BIT,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x2d: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x2e: {
    instruction: CPU_INSTRUCTIONS.ROL,
    cycle: 6,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x2f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x30: {
    instruction: CPU_INSTRUCTIONS.BMI,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0x31: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0x32: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x33: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x34: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x35: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x36: {
    instruction: CPU_INSTRUCTIONS.ROL,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x37: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x38: {
    instruction: CPU_INSTRUCTIONS.SEC,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x39: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0x3a: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x3b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x3c: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x3d: {
    instruction: CPU_INSTRUCTIONS.AND,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x3e: {
    instruction: CPU_INSTRUCTIONS.ROL,
    cycle: 7,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x3f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x40: {
    instruction: CPU_INSTRUCTIONS.RTI,
    cycle: 6,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x41: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0x42: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x43: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x44: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x45: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x46: {
    instruction: CPU_INSTRUCTIONS.LSR,
    cycle: 5,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x47: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x48: {
    instruction: CPU_INSTRUCTIONS.PHA,
    cycle: 3,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x49: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0x4a: {
    instruction: CPU_INSTRUCTIONS.LSR,
    cycle: 2,
    mode: CPU_ADDRESSINGS.ACCUMULATOR,
  },
  0x4b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x4c: {
    instruction: CPU_INSTRUCTIONS.JMP,
    cycle: 0,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x4d: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x4e: {
    instruction: CPU_INSTRUCTIONS.LSR,
    cycle: 6,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x4f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x50: {
    instruction: CPU_INSTRUCTIONS.BVC,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0x51: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0x52: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x53: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x54: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x55: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x56: {
    instruction: CPU_INSTRUCTIONS.LSR,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x57: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x58: {
    instruction: CPU_INSTRUCTIONS.CLI,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x59: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0x5a: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x5b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x5c: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x5d: {
    instruction: CPU_INSTRUCTIONS.EOR,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x5e: {
    instruction: CPU_INSTRUCTIONS.LSR,
    cycle: 7,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x5f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x60: {
    instruction: CPU_INSTRUCTIONS.RTS,
    cycle: 6,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x61: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0x62: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x63: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x64: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x65: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x66: {
    instruction: CPU_INSTRUCTIONS.ROR,
    cycle: 5,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x67: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x68: {
    instruction: CPU_INSTRUCTIONS.PLA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x69: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0x6a: {
    instruction: CPU_INSTRUCTIONS.ROR,
    cycle: 2,
    mode: CPU_ADDRESSINGS.ACCUMULATOR,
  },
  0x6b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x6c: {
    instruction: CPU_INSTRUCTIONS.JMP,
    cycle: 0,
    mode: CPU_ADDRESSINGS.INDIRECT,
  },
  0x6d: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x6e: {
    instruction: CPU_INSTRUCTIONS.ROR,
    cycle: 6,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x6f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x70: {
    instruction: CPU_INSTRUCTIONS.BVS,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0x71: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0x72: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x73: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x74: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x75: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x76: {
    instruction: CPU_INSTRUCTIONS.ROR,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x77: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x78: {
    instruction: CPU_INSTRUCTIONS.SEI,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x79: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0x7a: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x7b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x7c: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x7d: {
    instruction: CPU_INSTRUCTIONS.ADC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x7e: {
    instruction: CPU_INSTRUCTIONS.ROR,
    cycle: 7,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x7f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x80: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x81: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0x82: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x83: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x84: {
    instruction: CPU_INSTRUCTIONS.STY,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x85: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x86: {
    instruction: CPU_INSTRUCTIONS.STX,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0x87: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x88: {
    instruction: CPU_INSTRUCTIONS.DEY,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x89: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x8a: {
    instruction: CPU_INSTRUCTIONS.TXA,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x8b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x8c: {
    instruction: CPU_INSTRUCTIONS.STY,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x8d: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x8e: {
    instruction: CPU_INSTRUCTIONS.STX,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0x8f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x90: {
    instruction: CPU_INSTRUCTIONS.BCC,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0x91: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0x92: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x93: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x94: {
    instruction: CPU_INSTRUCTIONS.STY,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x95: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0x96: {
    instruction: CPU_INSTRUCTIONS.STX,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_Y,
  },
  0x97: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0x98: {
    instruction: CPU_INSTRUCTIONS.TYA,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x99: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0x9a: {
    instruction: CPU_INSTRUCTIONS.TXS,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0x9b: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x9c: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x9d: {
    instruction: CPU_INSTRUCTIONS.STA,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0x9e: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0x9f: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xa0: {
    instruction: CPU_INSTRUCTIONS.LDY,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xa1: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0xa2: {
    instruction: CPU_INSTRUCTIONS.LDX,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xa3: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xa4: {
    instruction: CPU_INSTRUCTIONS.LDY,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xa5: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xa6: {
    instruction: CPU_INSTRUCTIONS.LDX,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xa7: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xa8: {
    instruction: CPU_INSTRUCTIONS.TAY,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xa9: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xaa: {
    instruction: CPU_INSTRUCTIONS.TAX,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xab: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xac: {
    instruction: CPU_INSTRUCTIONS.LDY,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xad: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xae: {
    instruction: CPU_INSTRUCTIONS.LDX,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xaf: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xb0: {
    instruction: CPU_INSTRUCTIONS.BCS,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0xb1: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0xb2: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xb3: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xb4: {
    instruction: CPU_INSTRUCTIONS.LDY,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0xb5: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0xb6: {
    instruction: CPU_INSTRUCTIONS.LDX,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_Y,
  },
  0xb7: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xb8: {
    instruction: CPU_INSTRUCTIONS.CLV,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xb9: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0xba: {
    instruction: CPU_INSTRUCTIONS.TSX,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xbb: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xbc: {
    instruction: CPU_INSTRUCTIONS.LDY,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0xbd: {
    instruction: CPU_INSTRUCTIONS.LDA,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0xbe: {
    instruction: CPU_INSTRUCTIONS.LDX,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0xbf: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xc0: {
    instruction: CPU_INSTRUCTIONS.CPY,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xc1: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0xc2: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xc3: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xc4: {
    instruction: CPU_INSTRUCTIONS.CPY,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xc5: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xc6: {
    instruction: CPU_INSTRUCTIONS.DEC,
    cycle: 5,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xc7: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xc8: {
    instruction: CPU_INSTRUCTIONS.INY,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xc9: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xca: {
    instruction: CPU_INSTRUCTIONS.DEX,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xcb: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xcc: {
    instruction: CPU_INSTRUCTIONS.CPY,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xcd: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xce: {
    instruction: CPU_INSTRUCTIONS.DEC,
    cycle: 6,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xcf: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xd0: {
    instruction: CPU_INSTRUCTIONS.BNE,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0xd1: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0xd2: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xd3: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xd4: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xd5: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0xd6: {
    instruction: CPU_INSTRUCTIONS.DEC,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0xd7: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xd8: {
    instruction: CPU_INSTRUCTIONS.CLD,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xd9: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0xda: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xdb: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xdc: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xdd: {
    instruction: CPU_INSTRUCTIONS.CMP,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0xde: {
    instruction: CPU_INSTRUCTIONS.DEC,
    cycle: 7,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0xdf: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xe0: {
    instruction: CPU_INSTRUCTIONS.CPX,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xe1: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_X,
  },
  0xe2: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xe3: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xe4: {
    instruction: CPU_INSTRUCTIONS.CPX,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xe5: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 3,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xe6: {
    instruction: CPU_INSTRUCTIONS.INC,
    cycle: 5,
    mode: CPU_ADDRESSINGS.ZERO_PAGE,
  },
  0xe7: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xe8: {
    instruction: CPU_INSTRUCTIONS.INX,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xe9: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMMEDIATE,
  },
  0xea: {
    instruction: CPU_INSTRUCTIONS.NOP,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xeb: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xec: {
    instruction: CPU_INSTRUCTIONS.CPX,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xed: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xee: {
    instruction: CPU_INSTRUCTIONS.INC,
    cycle: 6,
    mode: CPU_ADDRESSINGS.ABSOLUTE,
  },
  0xef: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xf0: {
    instruction: CPU_INSTRUCTIONS.BEQ,
    cycle: 2,
    mode: CPU_ADDRESSINGS.RELATIVE,
  },
  0xf1: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 5,
    mode: CPU_ADDRESSINGS.INDEXED_INDIRECT_Y,
  },
  0xf2: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xf3: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xf4: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xf5: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0xf6: {
    instruction: CPU_INSTRUCTIONS.INC,
    cycle: 6,
    mode: CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X,
  },
  0xf7: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },

  0xf8: {
    instruction: CPU_INSTRUCTIONS.SED,
    cycle: 2,
    mode: CPU_ADDRESSINGS.IMPLIED,
  },
  0xf9: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y,
  },
  0xfa: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xfb: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xfc: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
  0xfd: {
    instruction: CPU_INSTRUCTIONS.SBC,
    cycle: 4,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0xfe: {
    instruction: CPU_INSTRUCTIONS.INC,
    cycle: 7,
    mode: CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X,
  },
  0xff: { instruction: CPU_INSTRUCTIONS.INV, cycle: 0, mode: null },
};

export { CPU_INTS, CPU_ADDRESSINGS, CPU_INSTRUCTIONS, CPU_OPS };
