import * as Sentry from '@sentry/node';
import { IUser } from '../models';
import { createOrganization } from './organization';
import { addMembershipsOrg } from './membershipOrg';
import { OWNER, ACCEPTED } from '../variables';
import { sendMail } from '../helpers/nodemailer';
import { TokenService } from '../services';
import { TOKEN_EMAIL_CONFIRMATION } from '../variables';

/**
 * Send magic link to verify email to [email]
 * for user and workspace.
 * @param {Object} obj
 * @param {String} obj.email - email
 * @returns {Boolean} success - whether or not operation was successful
 */
const sendEmailVerification = async ({ email }: { email: string }) => {
	try {
		const token = await TokenService.createToken({
			type: TOKEN_EMAIL_CONFIRMATION,
			email
		});

		const subject = `Infisical - Confirmation Code (${token})`

		// send mail
		await sendMail({
			template: 'emailVerification.handlebars',
			subjectLine: subject,
			recipients: [email],
			substitutions: {
				title: subject,
				description: "Email - Confirmation Code",
				year: new Date().getFullYear(),
				code: token
			}
		});
	} catch (err) {
		Sentry.setUser(null);
		Sentry.captureException(err);
		throw new Error(
			"Ouch. We weren't able to send your email verification code"
		);
	}
};

/**
 * Validate [code] sent to [email]
 * @param {Object} obj
 * @param {String} obj.email - emai
 * @param {String} obj.code - code that was sent to [email]
 */
const checkEmailVerification = async ({
	email,
	code
}: {
	email: string;
	code: string;
}) => {
	try {
		await TokenService.validateToken({
			type: TOKEN_EMAIL_CONFIRMATION,
			email,
			token: code
		});
	} catch (err) {
		Sentry.setUser(null);
		Sentry.captureException(err);
		throw new Error("Oops. We weren't able to verify");
	}
};

/**
 * Initialize default organization named [organizationName] with workspace
 * for user [user]
 * @param {Object} obj
 * @param {String} obj.organizationName - name of organization to initialize
 * @param {IUser} obj.user - user who we are initializing for
 */
const initializeDefaultOrg = async ({
	organizationName,
	user
}: {
	organizationName: string;
	user: IUser;
}) => {
	try {
		// create organization with user as owner and initialize a free
		// subscription
		const organization = await createOrganization({
			email: user.email,
			name: organizationName
		});

		await addMembershipsOrg({
			userIds: [user._id.toString()],
			organizationId: organization._id.toString(),
			roles: [OWNER],
			statuses: [ACCEPTED]
		});
	} catch (err) {
		throw new Error(`Failed to initialize default organization and workspace [err=${err}]`);
	}
};

export { sendEmailVerification, checkEmailVerification, initializeDefaultOrg };
