import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function user_view() {
  try {
    await prisma.$executeRaw`
  CREATE OR REPLACE VIEW "system".vw_show_user_info
      AS SELECT u.code,
    u.username AS "user",
    u.enabled,
    u.role_code,
    u.status_code,
    u.password,
    r.name AS rol,
    st.name AS status,
    e.code AS employee_code,
    e.personal_data_code,
    e.job_position_code,
    e.administrative_unit_code,
    pd.first_name,
    pd.last_name,
    pd.identify_acronym,
    pd.identify_number,
    pd.birth_date,
    pd.gender,
    pd.phone_number,
    pd.home_address,
    jp.name AS job_tittle,
    au.name AS administrative_unit_name,
    au.code AS administrative_code,
    s.name AS sector_name,
    s.code AS sector_code,
    p.name AS program_name,
    p.code AS program_code,
    a.name AS activity_name,
    a.code AS activity_code
   FROM system."User" u
     inner JOIN "system"."Status" st ON st.code = u.status_code
     inner JOIN "system"."Role" r ON r.code = u.role_code
     inner JOIN rrhh."Employeed" e ON e.code = u.employee_code
     inner JOIN rrhh."Personal_data" pd ON e.personal_data_code = pd.code
     inner JOIN rrhh."Job_position" jp ON e.job_position_code = jp.code
     inner JOIN rrhh."Administrative_unit" au ON au.code = e.administrative_unit_code
    inner JOIN rrhh."Sector" s ON s.code = au.sector_code
    inner JOIN rrhh."Program" p ON p.code = au.program_code AND p.sector_code = s.code
    inner JOIN rrhh."Activity" a ON a.code = au.activity_code AND a.sector_code = s.code AND a.program_code = p.code
  ORDER BY u.code;
    `;
  } catch (error) {
    console.log("Error creating view user:", error);
  } finally {
    await prisma.$disconnect();
    console.log("user view created");
  }
}
