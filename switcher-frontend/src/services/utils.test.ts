import { describe, it, expect, vi } from 'vitest';
import { handleNotificationResponse } from './utils';
import * as utils from './utils';

describe('utils', () => {
  it('handleNotificationResponse should call action with success', () => {
    const spyHandleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const data = { playerID: 1, username: 'test' };
    const text_success = 'success';
    const text_error = 'error';
    const action = vi.fn();
    handleNotificationResponse(data, text_success, text_error, action);
    expect(spyHandleNotificationResponse).toHaveBeenCalled();
    expect(action).toHaveBeenCalled();
  });

  it('handleNotificationResponse should not call action with error', () => {
    const spyHandleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const data = { detail: [{ type: 'unknown', msg: 'error' }] };
    const text_success = 'success';
    const text_error = 'error';
    const action = vi.fn();
    handleNotificationResponse(data, text_success, text_error, action);
    expect(spyHandleNotificationResponse).toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it('Test handleNotificationResponse with error withouth array', () => {
    const spyHandleNotificationResponse = vi.spyOn(
      utils,
      'handleNotificationResponse'
    );
    const data = { detail: 'error' };
    const text_success = 'success';
    const text_error = 'error';
    const action = vi.fn();
    handleNotificationResponse(data, text_success, text_error, action);
    expect(spyHandleNotificationResponse).toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });
});
