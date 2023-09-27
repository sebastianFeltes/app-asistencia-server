export async function buscarAlumnoPorId(req, res) {
	const id = req.params.id;
	try {
		if (!id) res.status(400);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	}
}
