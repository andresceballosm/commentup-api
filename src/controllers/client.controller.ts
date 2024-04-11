import { Response } from 'express';
import { TITLE_ERROR } from '../constants/messages.constants';
const axios = require('axios');

export async function register(req: any, res: Response) {
	try {
		const { email, type } = req.body;
		axios({
			method: 'post',
			url: 'https://api.clickup.com/api/v2/list/205754846/task',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'pk_49544414_XPIFKILF5LN5MBA1F2FLCWC3ED2HBVQE',
			},
			data: {
				name: email,
				priority: 3,
				notify_all: true,
				custom_fields: [
					{
						id: '6fcaaf14-07ee-4e03-ad29-ab48e2cf63ee',
						value: '31ba69f9-2b7e-4d11-9a11-63d87abfa261',
					},
					{
						id: '1d464327-5830-4f33-a945-29ec59db11fc',
						value: type,
					},
					{
						id: '4da0f256-3ef4-4ea3-954b-3c95843c2b7f',
						value: email,
					},
				],
			},
		})
			.then((response: any) => {
				res.status(200).json(response.data);
			})
			.catch((err: any) => {
				res.status(500).json({ message: err });
			});
	} catch (error) {
		console.log('error', error);
		return res.status(400).send({
			error: true,
			message: {
				title: TITLE_ERROR,
				message: 'error',
			},
			response: null,
		});
	}
}
