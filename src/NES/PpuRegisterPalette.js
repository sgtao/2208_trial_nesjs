// epuRegisterPalette.js';
import { Register8bit } from './Register.js';

// Pallet Table
var PALETTES = [
  /* 0x00 */ 0xff757575, /* 0x01 */ 0xff8f1b27, /* 0x02 */ 0xffab0000,
  /* 0x03 */ 0xff9f0047, /* 0x04 */ 0xff77008f, /* 0x05 */ 0xff1300ab,
  /* 0x06 */ 0xff0000a7, /* 0x07 */ 0xff000b7f, /* 0x08 */ 0xff002f43,
  /* 0x09 */ 0xff004700, /* 0x0a */ 0xff005100, /* 0x0b */ 0xff173f00,
  /* 0x0c */ 0xff5f3f1b, /* 0x0d */ 0xff000000, /* 0x0e */ 0xff000000,
  /* 0x0f */ 0xff000000, /* 0x10 */ 0xffbcbcbc, /* 0x11 */ 0xffef7300,
  /* 0x12 */ 0xffef3b23, /* 0x13 */ 0xfff30083, /* 0x14 */ 0xffbf00bf,
  /* 0x15 */ 0xff5b00e7, /* 0x16 */ 0xff002bdb, /* 0x17 */ 0xff0f4fcb,
  /* 0x18 */ 0xff00738b, /* 0x19 */ 0xff009700, /* 0x1a */ 0xff00ab00,
  /* 0x1b */ 0xff3b9300, /* 0x1c */ 0xff8b8300, /* 0x1d */ 0xff000000,
  /* 0x1e */ 0xff000000, /* 0x1f */ 0xff000000, /* 0x20 */ 0xffffffff,
  /* 0x21 */ 0xffffbf3f, /* 0x22 */ 0xffff975f, /* 0x23 */ 0xfffd8ba7,
  /* 0x24 */ 0xffff7bf7, /* 0x25 */ 0xffb777ff, /* 0x26 */ 0xff6377ff,
  /* 0x27 */ 0xff3b9bff, /* 0x28 */ 0xff3fbff3, /* 0x29 */ 0xff13d383,
  /* 0x2a */ 0xff4bdf4f, /* 0x2b */ 0xff98f858, /* 0x2c */ 0xffdbeb00,
  /* 0x2d */ 0xff000000, /* 0x2e */ 0xff000000, /* 0x2f */ 0xff000000,
  /* 0x30 */ 0xffffffff, /* 0x31 */ 0xffffe7ab, /* 0x32 */ 0xffffd7c7,
  /* 0x33 */ 0xffffcbd7, /* 0x34 */ 0xffffc7ff, /* 0x35 */ 0xffdbc7ff,
  /* 0x36 */ 0xffb3bfff, /* 0x37 */ 0xffabdbff, /* 0x38 */ 0xffa3e7ff,
  /* 0x39 */ 0xffa3ffe3, /* 0x3a */ 0xffbff3ab, /* 0x3b */ 0xffcfffb3,
  /* 0x3c */ 0xfff3ff9f, /* 0x3d */ 0xff000000, /* 0x3e */ 0xff000000,
  /* 0x3f */ 0xff000000,
];

// PPU Registers
/**
 *
 */
class PpuControlRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuControlRegister = true;
    this.NMI_VBLANK_BIT = 7;
    this.MASTER_SLAVE_BIT = 6;
    this.SPRITES_SIZE_BIT = 5;
    this.BACKGROUND_PATTERN_TABLE_BIT = 4;
    this.SPRITES_PATTERN_TABLE_BIT = 3;
    this.INCREMENT_ADDRESS_BIT = 2;
    this.NAME_TABLE_ADDRESS_BIT = 0;
    this.NAME_TABLE_ADDRESS_BITS_WIDTH = 2;
  }
  /**
   *
   */
  isIncrementAddressSet() {
    return this.isBitSet(this.INCREMENT_ADDRESS_BIT);
  }

  /**
   *
   */
  enabledNmi() {
    return this.isBitSet(this.NMI_VBLANK_BIT);
  }

  /**
   *
   */
  isSpriteSize16() {
    return this.isBitSet(this.SPRITES_SIZE_BIT);
  }

  /**
   *
   */
  getBackgroundPatternTableNum() {
    return this.loadBit(this.BACKGROUND_PATTERN_TABLE_BIT);
  }

  /**
   *
   */
  getSpritesPatternTableNum() {
    return this.loadBit(this.SPRITES_PATTERN_TABLE_BIT);
  }

  /**
   *
   */
  getNameTableAddress() {
    return this.loadBits(
      this.NAME_TABLE_ADDRESS_BIT,
      this.NAME_TABLE_ADDRESS_BITS_WIDTH
    );
  }
}
/**
 *
 */
class PpuMaskRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuMaskRegister = true;
    this.GREYSCALE_BIT = 0;
    this.LEFTMOST_BACKGROUND_VISIBLE_BIT = 1;
    this.LEFTMOST_SPRITES_VISIBLE_BIT = 2;
    this.BACKGROUND_VISIBLE_BIT = 3;
    this.SPRITES_VISIBLE_BIT = 4;
    this.EMPHASIZE_RED_BIT = 5;
    this.EMPHASIZE_GREEN_BIT = 6;
    this.EMPHASIZE_BLUE_BIT = 7;
  }
  /**
   *
   */
  isGreyscale() {
    return this.isBitSet(this.GREYSCALE_BIT);
  }

  /**
   *
   */
  isLeftMostBackgroundVisible() {
    return this.isBitSet(this.LEFTMOST_BACKGROUND_VISIBLE_BIT);
  }

  /**
   *
   */
  isLeftMostSpritesVisible() {
    return this.isBitSet(this.LEFTMOST_SPRITES_VISIBLE_BIT);
  }

  /**
   *
   */
  isBackgroundVisible() {
    return this.isBitSet(this.BACKGROUND_VISIBLE_BIT);
  }

  /**
   *
   */
  isSpritesVisible() {
    return this.isBitSet(this.SPRITES_VISIBLE_BIT);
  }

  /**
   *
   */
  emphasisRed() {
    return this.isBitSet(this.EMPHASIZE_RED_BIT);
  }

  /**
   *
   */
  emphasisGreen() {
    return this.isBitSet(this.EMPHASIZE_GREEN_BIT);
  }

  /**
   *
   */
  emphasisBlue() {
    return this.isBitSet(this.EMPHASIZE_BLUE_BIT);
  }
}
/**
 *
 */
class PpuStatusRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuStatusRegister = true;
    this.VBLANK_BIT = 7;
    this.SPRITE_ZERO_HIT_BIT = 6;
    this.SPRITE_OVERFLOW_BIT = 5;
    this.VRAM_SHOULD_BE_IGNORE = 4;
  }
  /**
   *
   */
  setVBlank() {
    this.setBit(this.VBLANK_BIT);
  }

  /**
   *
   */
  clearVBlank() {
    this.clearBit(this.VBLANK_BIT);
  }

  /**
   *
   */
  setZeroHit() {
    this.setBit(this.SPRITE_ZERO_HIT_BIT);
  }

  /**
   *
   */
  clearZeroHit() {
    this.clearBit(this.SPRITE_ZERO_HIT_BIT);
  }

  /**
   *
   */
  setOverflow() {
    this.setBit(this.SPRITE_OVERFLOW_BIT);
  }

  /**
   *
   */
  clearOverflow() {
    this.clearBit(this.SPRITE_OVERFLOW_BIT);
  }
}

export { PALETTES, PpuControlRegister, PpuMaskRegister, PpuStatusRegister };
