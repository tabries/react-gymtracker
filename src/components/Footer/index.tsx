import { NavLink } from "react-router-dom";
import StraightenIcon from "@mui/icons-material/Straighten";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import HistoryIcon from "@mui/icons-material/History";

export const Footer = () => {
  return (
    <footer className="grid grid-cols-3">
      <NavLink to="/routines">
        <div
          className="h-[6.25rem] content-center
        bg-blue-primary text-white text-[20px] font-oswald
        flex flex-col items-center justify-center"
        >
          <EventRepeatIcon fontSize="large" />
          Routines
        </div>
      </NavLink>
      <NavLink to="/history">
        <div
          className="h-[6.25rem] content-center
        bg-orange text-white text-[20px] font-oswald
        flex flex-col items-center justify-center"
        >
          <HistoryIcon fontSize="large" />
          History
        </div>
      </NavLink>
      <NavLink
        to="/weight"
        className="h-[6.25rem] content-center
        bg-mustard text-white text-[20px] font-oswald
        flex flex-col items-center justify-center"
      >
        <StraightenIcon fontSize="large" />
        Weight
      </NavLink>
    </footer>
  );
};
