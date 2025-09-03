// import { Request, Response } from 'express';
// import BloodRequest from '../models/bloodRequest.model';

// export const createBloodRequest = async (req: Request, res: Response) => {
//   try {
//     const {
//       praniAadharNumber,
//       species,
//       breed,
//       age,
//       location,
//       quantity,
//       reason,
//       healthDescription,
//       healthFileUrl,
//     } = req.body;

//     const image = req.file?.filename;


//     const newRequest = new BloodRequest({
//       praniAadharNumber,
//       species,
//       breed,
//       age,
//       location,
//       quantity,
//       reason,
//       image: image || undefined,
//       healthRecord: healthDescription
//         ? {
//             description: healthDescription,
//             fileUrl: healthFileUrl || '',
//           }
//         : undefined,
   
//     });

//     await newRequest.save();

//     res.status(201).json({ message: 'Blood request submitted successfully', request: newRequest });
//   } catch (err) {
//     console.error('Error saving blood request:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getAllBloodRequests = async (req: Request, res: Response) => {
//   try {
//     const requests = await BloodRequest.find().sort({ requestedAt: -1 });
//     res.status(200).json({ requests });
//     console.log('request',requests);
    
//   } catch (err) {
//     console.error('Error fetching blood requests:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



import { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import BloodRequest from '../models/bloodRequest.model';

export const createBloodRequest = async (req: Request, res: Response) => {
  try {
    const {
      praniAadharNumber,
      species,
      breed,
      age,
      bloodGroup,
      location,
      quantity,
      reason,
      healthDescription,
      healthFileUrl,
    } = req.body;

    const file = req.file;
    let imagePath: string | undefined;

    // If optional image is uploaded, forward it to media service
    if (file) {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path));

      const mediaResponse = await axios.post(
        `${process.env.MEDIA_URL}?folder=bloodrequest`,
        formData,
        { headers: formData.getHeaders() }
      );

      imagePath = (mediaResponse as any).data.url;

      fs.unlinkSync(file.path); // delete temp local file
    }

    const newRequest = new BloodRequest({
      praniAadharNumber,
      species,
      breed,
      age,
      bloodGroup,
      location,
      quantity,
      reason,
      image: imagePath, // remote file path if exists
      healthRecord: healthDescription
        ? {
            description: healthDescription,
            fileUrl: healthFileUrl || '',
          }
        : undefined,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Blood request submitted successfully', request: newRequest });
  } catch (err) {
    console.error('Error saving blood request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBloodRequests = async (req: Request, res: Response) => {
  try {
    const requests = await BloodRequest.find().sort({ requestedAt: -1 });
    res.status(200).json({ requests });
    console.log('request',requests);
    
  } catch (err) {
    console.error('Error fetching blood requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



export const assignMatchedDonors = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { matchedDonors } = req.body;

  try {
    const request = await BloodRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Fetch full donor details from admin service
    const donorDetails = await Promise.all(
      matchedDonors.map(async (donorId: string) => {
        const { data } = await axios.get(`https://server.pranimithra.in/admin/api/donor/by-id/${donorId}`);
        return data;
      })
    );

    // ✅ Use .set to safely assign embedded donor details
    request.set('matchedDonors', donorDetails);
    request.status = 'Matched';

    await request.save();
    res.status(200).json({ message: 'Donors matched', updated: request });

  } catch (err) {
    console.error('Error assigning matched donors:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// export const assignMatchedDonors = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { matchedDonors } = req.body;

//   try {
//     // Fetch full donor info from Admin Service
//     const donorDetailsPromises = matchedDonors.map((donorId: string) =>
//       axios.get(`http://localhost:5007/api/donor/by-id/${donorId}`)
//     );
//     const donorResponses = await Promise.all(donorDetailsPromises);
//     const donorDataList = donorResponses.map(res => res.data);

//     // Update the request with full donor details
//     const updated = await BloodRequest.findByIdAndUpdate(id, {
//       matchedDonors: donorDataList,
//       status: 'Matched',
//     }, { new: true });

//     res.status(200).json({ message: 'Donors matched', updated });
//   } catch (err) {
//     console.error('Match assignment error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// export const assignMatchedDonors = async (req: Request, res: Response):Promise<void> => {
//   try {
//     const { requestId } = req.params;
//     const { matchedDonors } = req.body;

//     const updated = await BloodRequest.findByIdAndUpdate(
//       requestId,
//       { matchedDonors, status: 'Matched' },
//       { new: true }
//     );

//     if (!updated) {
//       res.status(404).json({ message: 'Request not found' });
//       return 
//     }

//     res.status(200).json({ message: 'Donors matched', request: updated });
//   } catch (err) {
//     console.error('Error assigning donors:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


export const getMatchedBloodRequests = async (req:Request, res:Response) => {
  try {
    const requests = await BloodRequest.find({ status: 'Matched' })
      .populate('matchedDonors'); // ✅ this is mandatory
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching matched requests:', error);
    res.status(500).json({ message: 'Failed to fetch matched requests' });
  }
};





