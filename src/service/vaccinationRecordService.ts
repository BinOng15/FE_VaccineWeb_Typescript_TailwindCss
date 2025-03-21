import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance"; // Giả sử bạn có file axiosInstance.ts để cấu hình axios
import { CreateVaccinationRecordDTO, UpdateVaccinationRecordDTO, VaccinationRecordResponseDTO } from "../models/VaccinationRecord"; // Sử dụng VaccinationRecordResponseDTO

const vaccinationRecordService = {
  // Lấy tất cả bản ghi tiêm chủng
  getAllVaccinationRecord: async (): Promise<VaccinationRecordResponseDTO[]> => {
    try {
      const response: AxiosResponse = await axiosInstance.get("/api/VaccinationRecord/get-all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all vaccination records:", error);
      throw error;
    }
  },

  // Lấy bản ghi tiêm chủng theo ID
  getVaccinationRecordById: async (recordId: number): Promise<VaccinationRecordResponseDTO> => {
    try {
      const response: AxiosResponse = await axiosInstance.get(`api/VaccinationRecord/get-by-id/${recordId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vaccination record by ID ${recordId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách bản ghi tiêm chủng phân trang
  getVaccinationRecordPaged: async (pageNumber: number, pageSize: number): Promise<{ Data: VaccinationRecordResponseDTO[]; TotalCount: number }> => {
    try {
      const response: AxiosResponse = await axiosInstance.get(`api/VaccinationRecord/get-vaccination-records-paged/${pageNumber}/${pageSize}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching paged vaccination records:", error);
      throw error;
    }
  },

  // Tạo bản ghi tiêm chủng mới
  createVaccinationRecord: async (vaccinationRecordData: CreateVaccinationRecordDTO): Promise<VaccinationRecordResponseDTO> => {
    try {
      const response: AxiosResponse = await axiosInstance.post("api/VaccinationRecord/create-vaccination-record", vaccinationRecordData, {
        headers: {
          "Content-Type": "multipart/form-data", // Để hỗ trợ IFormFile (image)
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating vaccination record:", error);
      throw error;
    }
  },

  // Cập nhật bản ghi tiêm chủng
updateVaccinationRecord: async (id: number, vaccinationRecordData: UpdateVaccinationRecordDTO): Promise<boolean> => {
    try {
      if (!id || id <= 0) {
        throw new Error("Invalid record ID");
      }
      console.log(`Calling updateVaccinationRecord with id: ${id}, data:`, vaccinationRecordData);
      const response: AxiosResponse = await axiosInstance.put(
        `/api/VaccinationRecord/update-vaccination-record/${id}`, // Đường dẫn với / ở đầu
        vaccinationRecordData
      );
      console.log("Response from updateVaccinationRecord:", response.data);
      return response.data.success || response.data.message === "Vaccination record updated successfully.";
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`Axios error updating vaccination record ${id}:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error(`Unexpected error updating vaccination record ${id}:`, error);
      }
      throw error;
    }
  },

  // Xóa bản ghi tiêm chủng
  deleteVaccinationRecord: async (recordId: number): Promise<boolean> => {
    try {
      const response: AxiosResponse = await axiosInstance.delete(`api/VaccinationRecord/delete-vaccination-record/${recordId}`);
      return response.data.success; // Giả sử backend trả về boolean
    } catch (error) {
      console.error(`Error deleting vaccination record ${recordId}:`, error);
      throw error;
    }
  },
   updateAppointmentStatus: async (appointmentId: number, status: number): Promise<boolean> => {
    try {
      const response: AxiosResponse = await axiosInstance.put(
        `/api/Appointment/update-status/${appointmentId}/${status}`
      );
      return response.data.success || response.data.message === "Appointment status updated successfully.";
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái cuộc hẹn ${appointmentId}:`, error);
      throw error;
    }
  },
};

export default vaccinationRecordService;