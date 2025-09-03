import { Request, Response } from 'express';
import { ConsultationFeeModel } from '../models/consultationFee.model';

export const setConsultationFee = async (req: Request, res: Response):Promise<void> => {
  const { doctorId, fee } = req.body;
  if (!doctorId || fee === undefined) 
    res.status(400).json({ message: 'doctorId and fee required' });

  try {
    const updated = await ConsultationFeeModel.findOneAndUpdate(
      { doctorId },
      { fee },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Fee saved', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save fee', error: err });
  }
};

export const getConsultationFee = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  try {
    const fee = await ConsultationFeeModel.findOne({ doctorId });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json({ fee: fee.fee });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch fee', error: err });
  }
};
