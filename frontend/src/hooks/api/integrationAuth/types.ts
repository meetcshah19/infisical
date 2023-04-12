export type IntegrationAuth = {
    _id: string;
    workspace: string;
    integration: string;
    teamId?: string;
    accountId?: string;
}

export type App = {
    name: string;
    appId?: string;
    owner?: string;
}

export type Team = {
    name: string;
    teamId: string;
}

export type Environment = {
    name: string;
    environmentId: string;
}

export type Service = {
    name: string;
    serviceId: string;
}