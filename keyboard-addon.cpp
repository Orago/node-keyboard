#include <nan.h>
#include <node.h>
#include <windows.h>

using namespace v8;

HHOOK hookKeyDown = NULL;
HHOOK hookKeyUp = NULL;
Nan::Callback callbackKeyDown;
Nan::Callback callbackKeyUp;

LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
  if (nCode >= 0) {
    KBDLLHOOKSTRUCT* kbdStruct = (KBDLLHOOKSTRUCT*)lParam;
    int keyCode = kbdStruct->vkCode;

    if (wParam == WM_KEYDOWN || wParam == WM_SYSKEYDOWN) {
      Local<Value> argv[] = { Nan::New(keyCode), Nan::New(true) }; // Pass true to indicate key down
      callbackKeyDown.Call(2, argv);
    } else if (wParam == WM_KEYUP || wParam == WM_SYSKEYUP) {
      Local<Value> argv[] = { Nan::New(keyCode), Nan::New(false) }; // Pass false to indicate key up
      callbackKeyUp.Call(2, argv);
    }
  }

  return CallNextHookEx(wParam == WM_KEYDOWN || wParam == WM_SYSKEYDOWN ? hookKeyDown : hookKeyUp, nCode, wParam, lParam);
}

NAN_METHOD(KeyDown) { // Updated function name here
  if (info.Length() < 2 || !info[0]->IsFunction() || !info[1]->IsFunction()) {
    return Nan::ThrowError("Invalid arguments. Pass two callback functions (KeyDown and KeyUp).");
  }

  callbackKeyDown.Reset(Local<Function>::Cast(info[0]));
  callbackKeyUp.Reset(Local<Function>::Cast(info[1]));

  hookKeyDown = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);
  hookKeyUp = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);

  if (hookKeyDown == NULL || hookKeyUp == NULL) {
    return Nan::ThrowError("Failed to set the keyboard hooks.");
  }

  MSG msg;
  while (GetMessage(&msg, NULL, 0, 0)) {
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }

  UnhookWindowsHookEx(hookKeyDown);
  UnhookWindowsHookEx(hookKeyUp);
  hookKeyDown = NULL;
  hookKeyUp = NULL;
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("KeyDown").ToLocalChecked(), // Updated function name here
    Nan::GetFunction(Nan::New<FunctionTemplate>(KeyDown)).ToLocalChecked()); // Updated function name here
}

NODE_MODULE(keylogger, Init)