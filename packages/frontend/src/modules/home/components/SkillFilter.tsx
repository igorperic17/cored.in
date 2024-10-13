import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { MultiSelect, MultiSelectValue } from "@/components/MultiSelect";
import { SkillTag, SkillTags } from "@coredin/shared";
import { Icon } from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";

interface SkillFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onApply: (newTags: SkillTag[]) => void;
  availableTags: SkillTag[];
  initialTags: SkillTag[];
}

const SkillFilter: React.FC<SkillFilterProps> = ({ isOpen, onClose, onOpen, onApply, availableTags, initialTags }) => {
  const [localSelectedTags, setLocalSelectedTags] = useState<MultiSelectValue[]>(initialTags.map((tag) => {
    return { label: tag, value: tag }
  }));

  const handleTagChange = (tags: MultiSelectValue[]) => {
    setLocalSelectedTags(tags);
  };

  const handleApply = useCallback(() => {
    onApply(localSelectedTags.map(v => v.value as SkillTag));
    onClose();
  }, [localSelectedTags]);

  const handleToggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };
  const skillsText = useMemo(() => localSelectedTags.length === 1 ? "skill" : "skills", [localSelectedTags]);

  return (
    <>
      <Button onClick={handleToggle} leftIcon={<Icon as={FaFilter} />}>
        {localSelectedTags.length} {skillsText} selected
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply Tags</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MultiSelect
              options={availableTags.map((tag) => {
                return { label: tag, value: tag }
              })}
              value={localSelectedTags}
              onChange={handleTagChange}
              placeholder="Select Tags"
              menuPlacement="bottom"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleApply}>Apply</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SkillFilter;
