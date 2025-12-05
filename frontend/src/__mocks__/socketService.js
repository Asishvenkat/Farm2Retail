import { vi } from 'vitest';

export default {
  connect: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
  joinUser: vi.fn(),
  disconnect: vi.fn(),
  emitOrderCreated: vi.fn(),
  emitProductUpdated: vi.fn(),
  emitPriceChanged: vi.fn(),
  emitStockUpdate: vi.fn(),
  sendMessage: vi.fn(),
  emitTyping: vi.fn(),
};
