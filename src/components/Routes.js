import { MdDashboard } from 'react-icons/md';
import { FaUserMd } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export const getMenuItems = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const role = userInfo?.role;
  const store = useSelector((state) => state);
  const PatientData = store?.getAllPatients?.message?.patients

  const baseItems = [
    // { icon: MdDashboard, label: 'Dashboard', path: '/' },
    { icon: FaUser, label: 'Patients', path: `/patient-dashboard/${PatientData?.[0]?._id}` },
    // { icon: FaStickyNote, label: 'Notes', path: '/notes' },
  ];

  if (role === 'admin') {
    baseItems.splice(2, 0, { icon: FaUserMd, label: 'Doctors', path: '/doctors' });
  }

  return baseItems;
};