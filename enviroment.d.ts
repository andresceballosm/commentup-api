declare global {
	namespace NodeJS {
		interface ProcessEnv {
			GITHUB_AUTH_TOKEN: string;
			NODE_ENV: 'dev' | 'production' | 'local' | 'qa' | 'test';
			PORT?: string;
			MONGO_URI: string;
			JWT_SECRET: string;
			JWT_EXPIRE: string;
			PROVIDER_URL: string;
			CHAIN_ID: number;
			PRIVATE_KEY: string;
			ADDRESS: string;
			EMAIL_HOST: string;
			EMAIL_PORT: string;
			EMAIL_USER: string;
			EMAIL_PASS: string;
			EMAIL_FROM: string;
			STRIPE_SECRET_KEY: string;
			HUBSPOT_SECRET_KEY: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
