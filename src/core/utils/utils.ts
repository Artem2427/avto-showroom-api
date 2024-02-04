export class Utils {
  static clearEmpties(o) {
    for (const k in o) {
      if (!o[k] || typeof o[k] !== 'object') {
        continue;
      }

      // this.clearEmpties(o[k]); comment deep clearing
      if (Object.keys(o[k]).length === 0) {
        delete o[k];
      }
    }
    return o;
  }
}
