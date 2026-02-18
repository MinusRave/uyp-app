import { SystemConfig } from "wasp/entities";
import { GetSystemConfig, UpdateSystemConfig } from "wasp/server/operations";
import { HttpError } from "wasp/server";

type SystemConfigPayload = {
    enableSoftGate?: boolean;
    enableCookieBanner?: boolean;
};

export const getSystemConfig: GetSystemConfig<void, SystemConfig> = async (_args, context) => {
    // Public endpoint - no admin check needed for reading config

    // Find the first config or create default
    const config = await context.entities.SystemConfig.findFirst();

    if (!config) {
        return context.entities.SystemConfig.create({
            data: {
                enableSoftGate: false,
                enableCookieBanner: true
            }
        });
    }

    return config;
};

export const updateSystemConfig: UpdateSystemConfig<SystemConfigPayload, SystemConfig> = async (args, context) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    const config = await context.entities.SystemConfig.findFirst();

    if (!config) {
        return context.entities.SystemConfig.create({
            data: {
                enableSoftGate: args.enableSoftGate ?? false,
                enableCookieBanner: args.enableCookieBanner ?? true
            }
        });
    }

    const dataToUpdate: any = {};
    if (args.enableSoftGate !== undefined) dataToUpdate.enableSoftGate = args.enableSoftGate;
    if (args.enableCookieBanner !== undefined) dataToUpdate.enableCookieBanner = args.enableCookieBanner;

    return context.entities.SystemConfig.update({
        where: { id: config.id },
        data: dataToUpdate
    });
};
