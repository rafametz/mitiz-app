import { RewardForm } from "@/components/admin/RewardForm";
import { createReward } from "../actions";

export default function NovaRecompensaPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Nova recompensa</h1>
      <RewardForm action={createReward} />
    </div>
  );
}
