function RoleInput({ role, setRole }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-zinc-300">Interview Role</label>

      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Frontend Developer"
        className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 outline-none"
      />
    </div>
  );
}

export default RoleInput;
