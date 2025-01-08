import React from 'react';
import { Skill } from '../../../types/Skill';
import { valid_skill } from '../../../types/valid_skill';

type Props = {
    availableSkills: Skill[];
    selectedSkills: valid_skill[];
    employeeId: string;
    onChange: (skills: valid_skill[]) => void;
};

export const SkillSelector: React.FC<Props> = ({
    availableSkills,
    selectedSkills,
    employeeId,
    onChange,
}) => {
    const handleSkillChange = (skillId: string, checked: boolean, efficiency: number = 1) => {
        if (checked) {
            onChange([...selectedSkills, {
                employee_id: employeeId,
                skill_id: skillId,
                task_efficiency: efficiency
            }]);
        } else {
            onChange(selectedSkills.filter(skill => skill.skill_id !== skillId));
        }
    };

    const handleEfficiencyChange = (skillId: string, efficiency: number) => {
        const updatedSkills = selectedSkills.map(skill =>
            skill.skill_id === skillId
                ? { ...skill, task_efficiency: efficiency }
                : skill
        );
        onChange(updatedSkills);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                登録可能スキル
            </label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                    {availableSkills.map((skill) => {
                        const selectedSkill = selectedSkills.find(s => s.skill_id === skill.id);
                        return (
                            <div key={skill.id} className="space-y-2 flex items-center">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`skill-${skill.id}`}
                                        checked={!!selectedSkill}
                                        onChange={(e) => handleSkillChange(skill.id, e.target.checked)}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={`skill-${skill.id}`}
                                        className="ml-2 text-sm text-gray-700"
                                        style={{ color: skill.color.toString() }}
                                    >
                                        {skill.name}
                                    </label>
                                </div>
                                {selectedSkill && (
                                    <div className="ml-6">
                                        <label className="block text-xs text-gray-600 mb-1">
                                            効率
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="2"
                                            defaultValue={"1"}
                                            value={selectedSkill.task_efficiency}
                                            onChange={(e) => handleEfficiencyChange(skill.id, Number(e.target.value))}
                                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};