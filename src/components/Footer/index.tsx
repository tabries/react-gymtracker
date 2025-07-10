import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="grid grid-cols-3 gap-1">
      <NavLink to="/routines">
        <div className="h-[6.25rem] content-center text-center bg-[#FFDDDD]">
          Routines
        </div>
      </NavLink>
      <NavLink to="/history">
        <div className="h-[6.25rem] content-center text-center bg-[#CCEAFF]">
          History
        </div>
      </NavLink>
      <NavLink to="/routines">
        <div className="h-[6.25rem] content-center text-center bg-[#E4F2E1]">
          Measures
        </div>
      </NavLink>
    </footer>
  );
};
