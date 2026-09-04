import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay execution of the function until the time has elapsed', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear the old timer is and start a fresh countdown when the callback is called before the the previous timer times out', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced();
    vi.advanceTimersByTime(100);

    debounced();
    vi.advanceTimersByTime(200);

    debounced();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should forward the correct arguments to the original function', () => {
    const callback = vi.fn((_name: string, _age: number) => {});
    const debounced = debounce(callback, 300);

    debounced('Jane', 30);

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledWith('Jane', 30);
  });

  it('should use the default value of 300ms if wait is not specified', () => {
    const callback = vi.fn();
    const debounced = debounce(callback);

    debounced();
    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call debounced function if cancelled', () => {
    const callback = vi.fn();
    const debounced = debounce(callback);

    debounced();
    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    debounced.cancel();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should immediately call debounced function if flushed', () => {
    const callback = vi.fn();
    const debounced = debounce(callback);

    debounced();
    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).not.toHaveBeenCalled();

    debounced.flush();
    expect(callback).toHaveBeenCalled();
  });

  it('run immediately on the first call, then run on next timeout', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200, true);

    debounced();

    expect(callback).toHaveBeenCalled();

    vi.advanceTimersByTime(199);
    expect(callback).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
