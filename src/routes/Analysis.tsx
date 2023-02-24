import { DataFrame } from "danfojs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pivotSessionLong } from "../analysis/sessionPostProcessing";
import dbManagerInstance from "../analysis/sessionStorage";
import Accuracy from "../components/Accuracy";
import RunningWPM from "../components/RunningWPM";
import WPM from "../components/WPM";
import "../styles/Analysis.scss";

const Vis = () => {
  const [session, setSession]: [DataFrame | undefined, Function] = useState();

  useEffect(() => {
    const fetchSessions = async () => {
      const db = await dbManagerInstance.getDB();
      // get the latest session
      const res = await db.sessions
        .findOne({
          sort: [{ timestamp: "desc" }],
        })
        .exec();
      const history = res.get("history");
      const c = pivotSessionLong(history);
      setSession(c);
    };
    fetchSessions();
  }, []);

  // const sessions = await
  return (
    <div>
      {session ? (
        <div>
          <WPM session={session} />
          <Accuracy session={session} />
          <RunningWPM session={session} />
        </div>
      ) : null}
      <Link to="/" className="btn btn-success mt-2">
        test again
      </Link>
    </div>
  );
};

export default Vis;
