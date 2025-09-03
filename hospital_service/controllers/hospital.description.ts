// controllers/messageController.ts
import { Request, Response } from 'express';
import { Hospitaldescription } from '../models/hospital.description';

// export const createMessage = async (req: Request, res: Response) => {
//   try {
//     const { content } = req.body;
//     const message = new Hospitaldescription({ content });
//     await message.save();
//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create message' });
//   }
// };

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content, organisation_id } = req.body;

    const message = new Hospitaldescription({ content, organisation_id });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organisation_id } = req.query; // or use req.body if sent in POST

    if (!organisation_id) {
    res.status(400).json({ error: "Missing organisation_id" });
    return 
    }

    const messages = await Hospitaldescription.find({ organisation_id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const updateMessage = async (req: Request, res: Response):Promise<void> => {
  try {
    const { content } = req.body;
    const message = await Hospitaldescription.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return 
    }

    res.json(message);
  } catch {
    res.status(500).json({ error: 'Failed to update message' });
  }
};


export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Hospitaldescription.findByIdAndDelete(req.params.id);

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return 
    }

    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
