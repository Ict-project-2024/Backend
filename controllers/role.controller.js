import Role from '../models/Role.js'

export const createRole = async (req, res, next) => {
    try {

        if (req.body.role && req.body.role !== '') {
            const role = await Role.create(req.body);
            res.status(200).json(role);
        }
        else {
            return res.status(400).send("bad request");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;

        const role = await Role.findByIdAndUpdate(id, req.body);

        if (!role) {
            return res.status(404).json({ message: "role not found" });
        }

        const updatedRole = await Role.findById(id);
        res.status(200).json(updatedRole);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({});
        res.status(200).json(roles);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const deleteRole = async (req, res) => {
    try {
      const { id } = req.params;
  
      const role = await Role.findByIdAndDelete(id);
  
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
  
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };