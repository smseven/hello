import { Card } from "@/components/Card";
import { Users, Eye, DollarSign, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Metric Cards placeholders */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">총 조회수</p>
              <h3 className="text-2xl font-bold text-gray-800">--</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">구독자 수</p>
              <h3 className="text-2xl font-bold text-gray-800">--</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">예상 수익</p>
              <h3 className="text-2xl font-bold text-gray-800">--</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">참여율</p>
              <h3 className="text-2xl font-bold text-gray-800">--</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">조회수 추이</h3>
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-400">차트 영역 (상세 이미지를 바탕으로 추후 구현)</p>
          </div>
        </Card>

        <Card className="p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">최근 인기 동영상</h3>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
               <p className="text-gray-400">리스트 영역</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
