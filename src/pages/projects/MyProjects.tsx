import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { myProjects, type ProjectItem } from "../../services/projectService";
import { formatDate } from "../../utils/date";

const MyProjects = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ProjectItem[]>([]);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await myProjects();
      setItems(res.items || []);
    } catch (e: unknown) {
        let message="Failed to fetch my projects"
        if(e instanceof Error){
            message=e.message
        }
        else if(typeof e==="string"){
            message=e
        }
      setErrorMsg(message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">My Projects</h2>
        <p className="text-sm text-slate-500">
          Here are the projects assigned to you
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600">
          No projects assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {items.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {p.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {p.description}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    p.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <p className="text-slate-500">Start Date</p>
                  <p className="text-slate-800 font-medium">
                    {formatDate(p.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Time Limit</p>
                  <p className="text-slate-800 font-medium">{p.timeLimit}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-slate-500 text-sm mb-2">Project Members</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {p.employees?.length ? (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {p.employees.map((m) => (
                        <li key={m._id} className="flex justify-between">
                          <span>{m.name}</span>
                          <span className="text-slate-500">{m.email}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No members</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={errorOpen}
        title="Error"
        message={errorMsg}
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />
    </div>
  );
};

export default MyProjects;