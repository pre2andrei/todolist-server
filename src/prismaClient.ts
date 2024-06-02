import { PrismaClient } from "@prisma/client";

const PrismaInstance = (function () {
  var instance: PrismaClient;
  return {
    getInstance: (): PrismaClient => {
      if (!instance) {
        instance = new PrismaClient();
      }
      return instance;
    },
  };
})();

export default PrismaInstance;
