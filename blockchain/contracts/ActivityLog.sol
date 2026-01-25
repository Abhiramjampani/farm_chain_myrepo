// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ActivityLog {
    
    struct Activity {
        bytes32 batchId;
        string activityType;
        string productName;
        uint256 quantity;
        bool isOrganic;
        uint256 timestamp;
        string evidenceHash;
        address recordedBy;
    }
    
    mapping(bytes32 => Activity[]) public batchActivities;
    
    uint256 public totalActivitiesRecorded;
    
    address public owner;
    
    event ActivityRecorded(
        bytes32 indexed batchId,
        string activityType,
        string productName,
        bool isOrganic,
        uint256 timestamp,
        address recordedBy
    );
    
    event OrganicStatusChecked(
        bytes32 indexed batchId,
        bool isOrganic,
        uint256 activityCount
    );
    
    constructor() {
        owner = msg.sender;
    }
    
    function recordActivity(
        bytes32 _batchId,
        string memory _activityType,
        string memory _productName,
        uint256 _quantity,
        bool _isOrganic,
        string memory _evidenceHash
    ) public returns (bool) {
        
        Activity memory newActivity = Activity({
            batchId: _batchId,
            activityType: _activityType,
            productName: _productName,
            quantity: _quantity,
            isOrganic: _isOrganic,
            timestamp: block.timestamp,
            evidenceHash: _evidenceHash,
            recordedBy: msg.sender
        });
        
        batchActivities[_batchId].push(newActivity);
        
        totalActivitiesRecorded++;
        
        emit ActivityRecorded(
            _batchId,
            _activityType,
            _productName,
            _isOrganic,
            block.timestamp,
            msg.sender
        );
        
        return true;
    }
    
    function getBatchActivities(bytes32 _batchId) 
        public 
        view 
        returns (Activity[] memory) 
    {
        return batchActivities[_batchId];
    }
    
    function getBatchActivityCount(bytes32 _batchId) 
        public 
        view 
        returns (uint256) 
    {
        return batchActivities[_batchId].length;
    }
    
    function isOrganicBatch(bytes32 _batchId) 
        public 
        returns (bool) 
    {
        Activity[] memory activities = batchActivities[_batchId];
        
        if (activities.length == 0) {
            return false;
        }
        
        for (uint256 i = 0; i < activities.length; i++) {
            if (!activities[i].isOrganic) {
                emit OrganicStatusChecked(_batchId, false, activities.length);
                return false;
            }
        }
        
        emit OrganicStatusChecked(_batchId, true, activities.length);
        return true;
    }
    
    function checkOrganicStatus(bytes32 _batchId) 
        public 
        view 
        returns (bool) 
    {
        Activity[] memory activities = batchActivities[_batchId];
        
        if (activities.length == 0) {
            return false;
        }
        
        for (uint256 i = 0; i < activities.length; i++) {
            if (!activities[i].isOrganic) {
                return false;
            }
        }
        
        return true;
    }
    
    function getActivity(bytes32 _batchId, uint256 _index) 
        public 
        view 
        returns (Activity memory) 
    {
        require(_index < batchActivities[_batchId].length, "Index out of bounds");
        return batchActivities[_batchId][_index];
    }
}
