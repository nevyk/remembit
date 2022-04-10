const isRunningInEmulator = function () {
  return process.env.FUNCTIONS_EMULATOR === 'true' ? true : false;
};

export { isRunningInEmulator };
