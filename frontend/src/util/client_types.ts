/*
 Generated by typeshare 1.0.0
*/

import { PermissionLevel, PermissionsTarget } from "../types";

export interface CreateBuildBody {
	name: string;
}

export interface CopyBuildBody {
	name: string;
}

export interface BuildVersionsQuery {
	page?: number;
	major?: number;
	minor?: number;
	patch?: number;
}

export interface CreateDeploymentBody {
	name: string;
	server_id: string;
}

export interface CopyDeploymentBody {
	name: string;
	server_id: string;
}

export interface GetContainerLogQuery {
	tail?: number;
}

export interface CreateGroupBody {
	name: string;
}

export interface PermissionsUpdateBody {
	user_id: string;
	permission: PermissionLevel;
	target_type: PermissionsTarget;
	target_id: string;
}

export interface ModifyUserEnabledBody {
	user_id: string;
	enabled: boolean;
}

export interface ModifyUserCreateServerBody {
	user_id: string;
	create_server_permissions: boolean;
}

export interface ModifyUserCreateBuildBody {
	user_id: string;
	create_build_permissions: boolean;
}

export interface CreateProcedureBody {
	name: string;
}

export interface CreateSecretBody {
	name: string;
	expires?: string;
}

export interface CreateServerBody {
	name: string;
	address: string;
}

export interface LoginOptions {
	local: boolean;
	github: boolean;
	google: boolean;
}

export interface TokenExchangeBody {
	token: string;
}

