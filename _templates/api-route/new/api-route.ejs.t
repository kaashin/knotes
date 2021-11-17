---
to: pages/api/<%= name %>.js
---
// =============================================================================
// Method Routing
// =============================================================================
export default async function (req, res) {
	switch (req.method) {
		case 'GET':
			getHandler(req, res);
			break;
		case 'POST':
			postHandler(req, res);
			break;
		case 'PUT':
			putHandler(req, res);
			break;
		case 'PATCH':
			patchHandler(req, res);
			break;
		default:
			res.status(400).json({ err: 'Method type not accepted' })
			break;
	}
}

// =============================================================================
// GET Routes
// =============================================================================
async function getHandler(req, res) {
	const { param } = req.query; //destructure query params
	const data = {};

	res.status('200').json({
		success: true,
		payload: data
	})
}

// =============================================================================
// POST Routes
// =============================================================================
async function postHandler(req, res) {
	const { payload: data }  = req.body; //destructure the reqeuest body
	
	// Do something with the data.
	
	res.status('200').json({
		success: true,
		payload: data
	})
}

async function putHandler(req, res) {
	const { payload: data }  = req.body; //destructure the reqeuest body
	
	// Do something with the data.

	res.status('200').json({
		success: true,
		payload: data
	})
}

async function patchHandler(req, res) {
	const { payload: data }  = req.body; //destructure the reqeuest body
	
	// Do something with the data.

	res.status('200').json({
		success: true,
		payload: data
	})
}

