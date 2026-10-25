import { redirect } from "next/navigation";
import {
  deleteUserAction,
  setUserActiveAction,
  setUserPasswordAction,
} from "@/app/admin/user-actions";
import { UserCreateForm } from "@/components/admin/UserCreateForm";
import { requireAdmin } from "@/lib/admin/guard";
import { getAdminCredentials } from "@/lib/admin/session";
import { canManageUsers, listUsers } from "@/lib/store/users";

export default async function UsersPage() {
  const session = await requireAdmin();
  if (!(await canManageUsers(session.sub))) {
    redirect("/admin");
  }
  const users = await listUsers();
  const owner = getAdminCredentials().username;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy">Staff logins</h1>
      <p className="mt-2 text-body">
        Create a username and password, then give those details to the person. The server
        owner account <span className="font-semibold text-navy">{owner}</span> can always sign in.
      </p>

      <div className="mt-6">
        <UserCreateForm />
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy">People</h2>
        {users.length === 0 ? (
          <p className="mt-3 rounded-[6px] border border-line bg-white px-5 py-8 text-body">
            No extra logins yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[6px] border border-line bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                <tr>
                  <th className="w-12 px-3 py-3">#</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Username</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Password</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-line align-top last:border-b-0">
                    <td className="px-3 py-3 font-semibold text-navy tabular-nums">{index + 1}</td>
                    <td className="px-3 py-3 font-semibold text-navy">{user.name}</td>
                    <td className="px-3 py-3 text-muted">{user.username}</td>
                    <td className="px-3 py-3 text-muted">{user.role}</td>
                    <td className="px-3 py-3 text-navy">{user.active ? "Active" : "Turned off"}</td>
                    <td className="px-3 py-3">
                      <form action={setUserPasswordAction} className="flex flex-col gap-2">
                        <input type="hidden" name="id" value={user.id} />
                        <label className="sr-only" htmlFor={`password-${user.id}`}>
                          New password for {user.name}
                        </label>
                        <input
                          id={`password-${user.id}`}
                          name="password"
                          type="text"
                          required
                          minLength={8}
                          placeholder="New password"
                          className="min-h-11 rounded-[6px] border border-line px-3 text-base text-navy"
                        />
                        <button
                          type="submit"
                          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[6px] bg-navy px-4 font-semibold text-white"
                        >
                          Set password
                        </button>
                      </form>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <form action={setUserActiveAction}>
                          <input type="hidden" name="id" value={user.id} />
                          <input type="hidden" name="active" value={user.active ? "false" : "true"} />
                          <button type="submit" className="min-h-11 cursor-pointer font-semibold text-blue">
                            {user.active ? "Turn off login" : "Turn on login"}
                          </button>
                        </form>
                        <form action={deleteUserAction}>
                          <input type="hidden" name="id" value={user.id} />
                          <button
                            type="submit"
                            className="min-h-11 cursor-pointer font-semibold text-navy"
                            formNoValidate
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
