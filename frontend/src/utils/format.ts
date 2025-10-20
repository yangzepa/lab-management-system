// Format utility functions

export const formatGrade = (grade: string): string => {
  const gradeMap: { [key: string]: string } = {
    'FRESHMAN': '1학년',
    'SOPHOMORE': '2학년',
    'JUNIOR': '3학년',
    'SENIOR': '4학년',
    'GRADUATE': '대학원',
  };
  return gradeMap[grade] || grade;
};

export const formatStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'ACTIVE': '활동중',
    'ON_LEAVE': '휴학',
    'GRADUATED': '졸업',
    'INTERNSHIP': '인턴십',
  };
  return statusMap[status] || status;
};

export const formatProjectStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'PLANNING': '계획',
    'IN_PROGRESS': '진행중',
    'COMPLETED': '완료',
    'ON_HOLD': '보류',
    'CANCELLED': '취소',
  };
  return statusMap[status] || status;
};

export const formatPriority = (priority: string): string => {
  const priorityMap: { [key: string]: string } = {
    'HIGH': '높음',
    'MEDIUM': '보통',
    'LOW': '낮음',
  };
  return priorityMap[priority] || priority;
};

export const formatTaskStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'TODO': '할 일',
    'IN_PROGRESS': '진행중',
    'DONE': '완료',
    'BLOCKED': '차단됨',
  };
  return statusMap[status] || status;
};
