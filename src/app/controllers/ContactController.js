const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController {
  // Listar todos os Registros
  async index(req, res) {
    const { orderBy } = req.query;
    const contacts = await ContactsRepository.findAll(orderBy);

    res.json(contacts);
  }

  // Listar um registro pelo ID
  async show(req, res) {
    const { id } = req.params;

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(contact);
  }

  // Criar um registro
  async store(req, res) {
    const {
      name, email, phone, category_id,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const contactExists = await ContactsRepository.findByEmail(email);

    if (contactExists) {
      return res.status(400).json({ error: 'This email is already in use!' });
    }

    const contact = await ContactsRepository.create({
      name, email, phone, category_id,
    });

    res.json(contact);
  }

  // Atualizar um Registro
  async update(req, res) {
    const { id } = req.params;
    const {
      name, email, phone, category_id,
    } = req.body;

    const contactExists = await ContactsRepository.findById(id);

    if (!contactExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const contactEmail = await ContactsRepository.findByEmail(email);

    if (contactEmail && contactEmail.id !== id) {
      return res.status(400).json({ error: 'This email is already in use!' });
    }

    const contact = await ContactsRepository.update(id, {
      name, email, phone, category_id,
    });

    res.json(contact);
  }

  // Remover um registro
  async delete(req, res) {
    const { id } = req.params;

    await ContactsRepository.delete(id);
    // 204: No Content
    res.sendStatus(204);
  }
}

// Singleton
module.exports = new ContactController();
